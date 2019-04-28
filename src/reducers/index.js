import { combineReducers } from "redux";
import transactions, * as fromTransactions from "./transactions";
import login, * as fromLogin from "./login";
import { TRANSACTIONS, LOGIN } from "../constants";

const reducers = combineReducers({
  transactions,
  login
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

//log in
export const accessTokensSelector = state =>
  fromLogin.accessTokensSelector(state[LOGIN]);
