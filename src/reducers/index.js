import { combineReducers } from "redux";
import transactions, * as fromTransactions from "./transactions";
import { TRANSACTIONS } from "../constants";

const reducers = combineReducers({
  transactions
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
