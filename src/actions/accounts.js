import { SET_ACCOUNTS } from "../constants/index";

export const setAccounts = accounts => ({
  type: SET_ACCOUNTS,
  payload: accounts
});
