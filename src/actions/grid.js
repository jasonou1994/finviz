import { SET_SELECTED_TRANSACTION_KEY } from "../constants/index";

export const setSelectedTransactionKey = key => ({
  type: SET_SELECTED_TRANSACTION_KEY,
  payload: key
});
