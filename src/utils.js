import moment from "moment";
import { INPUT, OUTPUT } from "./constants";

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

export const lineSeriesConverter = ({ transactions }) => {
  const incomeData = Object.keys(transactions).map((key, i) => {
    return {
      x: i,
      y: transactions[key][INPUT]
    };
  });
  const spendingData = Object.keys(transactions).map((key, i) => {
    return {
      x: i,
      y: transactions[key][OUTPUT]
    };
  });

  return {
    incomeData,
    spendingData
  };
};
