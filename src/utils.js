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

export const formatMilliseconds = milli => moment(milli).format("MMM Do, YYYY");

export const formatNumberAsDollars = number =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(number);

export const parseSSEFields = rawString => {
  return (
    rawString
      // since the string is multi line, each for a different field, split by line
      .split("\n")
      // remove empty lines
      .filter(field => field !== "")
      // massage fields so they can be parsed into JSON
      .map(field => {
        const fieldColonSplit = field
          .replace(/:/, "&&&&&&&&")
          .split("&&&&&&&&")
          .map(kv => kv.trim());

        const fieldObj = {
          [fieldColonSplit[0]]: fieldColonSplit[1]
        };
        return fieldObj;
      })
      .reduce((acc, cur) => {
        // handles if there are multiple fields of the same type, for example two data fields.
        const key = Object.keys(cur)[0];
        if (acc[key]) {
          acc[key] = `${acc[key]}\n${cur[key]}`;
        } else {
          acc[key] = cur[key];
        }
        return acc;
      }, {})
  );
};
