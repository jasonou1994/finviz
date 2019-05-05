import { combineReducers } from "redux";
import transactions, * as fromTransactions from "./transactions";
import login, * as fromLogin from "./login";
import graph, * as fromGraph from "./graph";
import { TRANSACTIONS, LOGIN, GRAPH } from "../constants";

const reducers = combineReducers({
  transactions,
  login,
  graph
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
