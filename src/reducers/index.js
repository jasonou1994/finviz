import { combineReducers } from "redux";
import { createSelector } from "reselect";
import { cloneDeep } from "lodash";
import moment from "moment";

import transactions, * as fromTransactions from "./transactions";
import login, * as fromLogin from "./login";
import graph, * as fromGraph from "./graph";
import grid, * as fromGrid from "./grid";
import { TRANSACTIONS, LOGIN, GRAPH, INPUT, OUTPUT, GRID } from "../constants";

const reducers = combineReducers({
  transactions,
  login,
  graph,
  grid
});
export default reducers;

//transactions
export const transactionsSelector = state =>
  fromTransactions.transactionsSelector(state[TRANSACTIONS]);
export const accountsSelector = state =>
  fromTransactions.accountsSelector(state[TRANSACTIONS]);
export const dailyTransactionsSelector = state =>
  fromTransactions.dailyTransactionsSelector(state[TRANSACTIONS]);
export const transactionsByDateInputOutputSelector = state =>
  fromTransactions.transactionsByDateInputOutputSelector(state[TRANSACTIONS]);
export const transactionsByAccountsSelector = state =>
  fromTransactions.transactionsByAccountsSelector(state[TRANSACTIONS]);
export const transactionsNoIntraAccountSelector = state =>
  fromTransactions.transactionsNoIntraAccountSelector(state[TRANSACTIONS]);
export const transactionsByCategorySelector = state =>
  fromTransactions.transactionsByCategorySelector(state[TRANSACTIONS]);
export const transactionsByNameSelector = state =>
  fromTransactions.transactionsByNameSelector(state[TRANSACTIONS]);

//log in
export const accessTokensSelector = state =>
  fromLogin.accessTokensSelector(state[LOGIN]);

//graph
export const graphFidelitySelector = state =>
  fromGraph.graphFidelitySelector(state[GRAPH]);

//grid
export const selectedTransactionKeySelector = state =>
  fromGrid.selectedTransactionKeySelector(state[GRID]);

//COMBINED
export const transactionsByDayCountCombinedSelector = createSelector(
  transactionsByDateInputOutputSelector,
  graphFidelitySelector,
  (transactions, days) => {
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
        acc[keyMap][INPUT] = acc[keyMap][INPUT] + transactions[cur][INPUT];
        acc[keyMap][OUTPUT] = acc[keyMap][OUTPUT] + transactions[cur][OUTPUT];
        acc[keyMap][TRANSACTIONS] = acc[keyMap][TRANSACTIONS].concat(
          transactions[cur][TRANSACTIONS]
        );
      }
      return acc;
    }, {});
  }
);
