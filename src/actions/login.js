import {
  SET_ACCESS_TOKEN,
  FETCH_ACCESS_TOKEN,
  FETCH_LOG_IN,
  SET_LOGGED_IN,
  USER_ID,
  USER_NAME,
  SET_USER_INFO
} from "../constants/index";

export const fetchAccessToken = token => ({
  type: FETCH_ACCESS_TOKEN,
  payload: token
});

export const setAccessToken = data => ({
  type: SET_ACCESS_TOKEN,
  payload: data
});

export const fetchLogIn = ({ user, password }) => ({
  type: FETCH_LOG_IN,
  payload: { user, password }
});

export const setLoggedIn = ({ status }) => ({
  type: SET_LOGGED_IN,
  payload: { status }
});

export const setUserInfo = ({ userName, userId }) => ({
  type: SET_USER_INFO,
  payload: { userName, userId }
});
