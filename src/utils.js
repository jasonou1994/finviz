import moment from "moment";
import { cloneDeep } from "lodash";

export const getStartEndTimePairsForPastMonths = (months = 12) => {
  const now = moment();
  now.add(1, "days");

  return Array(months)
    .fill(undefined)
    .map(() => {
      now.subtract(1, "days");
      const today = now.format("YYYY-MM-DD");
      now.subtract(1, "months");
      const yesterday = now.format("YYYY-MM-DD");

      return {
        today,
        yesterday
      };
    });
};

export const combineMonthData = data => {
  return data.reduce(
    (acc, cur) => {
      acc.transactions.push(...cur.transactions);
      acc.accounts = cur.accounts.reduce((accounts, test) => {
        if (
          !accounts.find(
            existingAccount => existingAccount.account_id === test.account_id
          )
        ) {
          accounts.push(test);
        }
        return accounts;
      }, acc.accounts);

      return acc;
    },
    {
      transactions: [],
      accounts: []
    }
  );
};

export const transactionsCombinerByDayCount = ({ transactions, days = 1 }) => {
  if (days <= 1) {
    return transactions;
  }

  //list of dates, ordered by most recent
  const orderedDates = Object.keys(transactions)
    .map(date => moment(date, "YYYY-MM-DD", true))
    .sort((a, b) => b - a)
    .map(date => date.format("YYYY-MM-DD"));

  return orderedDates.reduce((acc, cur, i) => {
    const newIndex = Math.floor(i / days); //newIndex is 0
    const keyMap = orderedDates[newIndex * days];
    if (!acc[keyMap]) {
      //if keyMap in acc doesnt exist
      acc[keyMap] = cloneDeep(transactions[cur]);
    } else {
      //if it does exist
      acc[keyMap].input = acc[keyMap].input + transactions[cur].input;
      acc[keyMap].output = acc[keyMap].output + transactions[cur].output;
      acc[keyMap].transactions = acc[keyMap].transactions.concat(
        transactions[cur].transactions
      );
    }
    return acc;
  }, {});
};

export const lineSeriesConverter = ({ transactions }) => {
  const incomeData = Object.keys(transactions).map((key, i) => {
    return {
      x: i,
      y: transactions[key].input
    };
  });
  const spendingData = Object.keys(transactions).map((key, i) => {
    return {
      x: i,
      y: transactions[key].output
    };
  });

  return {
    incomeData,
    spendingData
  };
};
