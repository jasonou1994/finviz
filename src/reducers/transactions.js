import { Map, List, Set } from "immutable";
import { createSelector } from "reselect";
import {
  SET_TRANSACTIONS,
  SET_ACCOUNTS,
  TRANSACTIONS,
  ACCOUNTS,
  RESET_TRANSACTIONS,
  AMOUNT,
  CATEGORY,
  NAME
} from "../constants";
import { graphFidelitySelector } from "./graph";

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
export const getTypeOfAccount = ({ accounts, id }) => {
  const account = accounts.find(account => account.account_id === id);

  return account ? account.type : null;
};

export const transactionsSelector = state => state.get(TRANSACTIONS);
export const accountsSelector = state => state.get(ACCOUNTS);

export const transactionsNoIntraAccountSelector = createSelector(
  transactionsSelector,
  accountsSelector,
  (transactions, accounts) => {
    return transactions.filter(tx => {
      const accountType = getTypeOfAccount({
        id: tx.account_id,
        accounts
      });

      return !accountType ||
        (accountType === "credit" && tx.amount < 0) ||
        (accountType === "depository" && tx.amount > 0)
        ? false
        : true;
    });
  }
);

export const dailyTransactionsSelector = createSelector(
  transactionsNoIntraAccountSelector,
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

export const transactionsByDateInputOutputSelector = createSelector(
  dailyTransactionsSelector,
  accountsSelector,
  (transactions, accounts) => {
    return Object.keys(transactions).reduce((result, date) => {
      result[date] = transactions[date].reduce(
        (acc, cur) => {
          const accountType = getTypeOfAccount({
            id: cur.account_id,
            accounts
          });

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
      return result;
    }, {});
  }
);

export const transactionsByCategorySelector = createSelector(
  transactionsNoIntraAccountSelector,
  transactions =>
    transactions.reduce((acc, cur) => {
      if (!cur[CATEGORY]) {
        return acc;
      }

      const category = cur[CATEGORY][0];

      if (acc[category]) {
        acc[category][AMOUNT] += cur[AMOUNT];
        acc[category][TRANSACTIONS].push(cur);
      } else {
        acc[category] = {
          [AMOUNT]: cur[AMOUNT],
          [TRANSACTIONS]: [cur]
        };
      }

      return acc;
    }, {})
);

export const transactionsByNameSelector = createSelector(
  transactionsNoIntraAccountSelector,
  transactions =>
    transactions.reduce((acc, cur) => {
      if (!cur[NAME]) {
        return acc;
      }

      const name = cur[NAME];

      if (acc[name]) {
        acc[name][AMOUNT] += cur[AMOUNT];
        acc[name][TRANSACTIONS].push(cur);
      } else {
        acc[name] = {
          [AMOUNT]: cur[AMOUNT],
          [TRANSACTIONS]: [cur]
        };
      }

      return acc;
    }, {})
);

export const transactionsByAccountsSelector = createSelector(
  dailyTransactionsSelector,
  transactions => {
    return Object.keys(transactions).reduce((result, date) => {
      result[date] = transactions[date].reduce((acc, cur) => {
        acc[cur.account_id]
          ? acc[cur.account_id].push(cur)
          : (acc[cur.account_id] = [cur]);
        return acc;
      }, {});

      return result;
    }, {});
  }
);
