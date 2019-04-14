import {
  FETCH_TRANSACTIONS,
  SET_TRANSACTIONS,
  RESET_TRANSACTIONS
} from "../constants/index";

export const fetchTransactions = accessToken => ({
  type: FETCH_TRANSACTIONS,
  payload: accessToken
});

export const setTransactions = transactions => ({
  type: SET_TRANSACTIONS,
  payload: transactions
});

export const resetTransactions = () => ({
  type: RESET_TRANSACTIONS
});
