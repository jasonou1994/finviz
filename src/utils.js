import moment from "moment";
export const getStartEndTimePairsForPastDays = (days = 365) => {
  const now = moment();
  now.add(1, "days");

  return Array(days)
    .fill(undefined)
    .map(() => {
      now.subtract(1, "days");
      return now.format("YYYY-MM-DD");
    });
};
