import { Map, List, Set } from "immutable";
import { createSelector } from "reselect";
import {
  SET_TRANSACTIONS,
  SET_ACCOUNTS,
  TRANSACTIONS,
  ACCOUNTS,
  RESET_TRANSACTIONS
} from "../constants/index";

const initialState = Map({
  [TRANSACTIONS]: List(),
  [ACCOUNTS]: List()
});

export default function transactions(state = initialState, action) {
  const { type, payload } = action;
  let newState;

  switch (type) {
    case SET_TRANSACTIONS: {
      newState = state.updateIn([TRANSACTIONS], list => list.push(...payload));
      break;
    }
    case SET_ACCOUNTS: {
      newState = state.setIn([ACCOUNTS], List(payload));
      break;
    }
    case RESET_TRANSACTIONS: {
      newState = state.set(TRANSACTIONS, List());
      break;
    }
    default: {
      newState = state;
    }
  }

  return newState;
}

export const transactionsSelector = state => state.get(TRANSACTIONS);
export const accountsSelector = state => state.get(ACCOUNTS);
export const dailyTransactionsSelector = createSelector(
  transactionsSelector,
  transactions => {
    const uniqueDates = [...new Set(transactions.map(tx => tx.date))].reduce(
      (acc, cur) => {
        acc[cur] = [];
        return acc;
      },
      {}
    );
    const txByDates = transactions.reduce((acc, cur) => {
      const { date } = cur;

      acc[date].push(cur);
      return acc;
    }, uniqueDates);

    return txByDates;
  }
);

export const getTypeOfAccount = ({ accounts, id }) => {
  const account = accounts.find(account => account.account_id === id);

  return account ? account.type : null;
};

export const transactionsByDateInputOutputSelector = createSelector(
  dailyTransactionsSelector,
  accountsSelector,
  (transactions, accounts) => {
    const newObj = {};

    Object.keys(transactions).forEach(date => {
      const accountsArranged = transactions[date].reduce(
        (acc, cur) => {
          const accountType = getTypeOfAccount({
            id: cur.account_id,
            accounts
          });

          //for the order of reducers
          if (!accountType) {
            return acc;
          }

          //do nothing for intraaccount transactions, i.e. transfer money from checkings to pay debt
          if (
            (accountType === "credit" && cur.amount < 0) ||
            (accountType === "depository" && cur.amount > 0)
          ) {
            return acc;
          }

          accountType === "credit"
            ? (acc.output += cur.amount)
            : (acc.input += cur.amount * -1);
          acc.transactions.push(cur);
          return acc;
        },
        {
          input: 0,
          output: 0,
          transactions: []
        }
      );

      newObj[date] = accountsArranged;
    });
    return newObj;
  }
);

export const transactionsByAccountsSelector = createSelector(
  dailyTransactionsSelector,
  transactions => {
    const newObj = {};

    Object.keys(transactions).forEach(date => {
      const accountsArranged = transactions[date].reduce((acc, cur) => {
        acc[cur.account_id]
          ? acc[cur.account_id].push(cur)
          : (acc[cur.account_id] = [cur]);
        return acc;
      }, {});

      newObj[date] = accountsArranged;
    });
    return newObj;
  }
);
