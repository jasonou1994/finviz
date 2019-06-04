import {
  FETCH_ADD_ACCOUNT,
  FETCH_LOG_IN,
  SET_LOGGED_IN,
  SET_USER_INFO,
  FETCH_LOG_OUT,
  FETCH_CREATE_USER,
} from '../constants/index'

export const addAccount = token => ({
  type: FETCH_ADD_ACCOUNT,
  payload: token,
})

export const fetchLogIn = ({ user, password }) => ({
  type: FETCH_LOG_IN,
  payload: { user, password },
})

export const fetchLogOut = () => ({ type: FETCH_LOG_OUT })

export const fetchCreateUser = ({ user, password }) => ({
  type: FETCH_CREATE_USER,
  payload: { user, password },
})

export const setLoggedIn = ({ status }) => ({
  type: SET_LOGGED_IN,
  payload: { status },
})

export const setUserInfo = ({ userName, userId }) => ({
  type: SET_USER_INFO,
  payload: { userName, userId },
})
