import { SET_ACCESS_TOKEN, FETCH_ACCESS_TOKEN } from "../constants/index";

export const fetchAccessToken = token => ({
  type: FETCH_ACCESS_TOKEN,
  payload: token
});

export const setAccessToken = data => ({
  type: SET_ACCESS_TOKEN,
  payload: data
});
