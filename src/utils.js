import moment from "moment";

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
      acc.accounts = cur.accounts;

      return acc;
    },
    {
      transactions: [],
      accounts: []
    }
  );
};
