import {
  REFRESH_TRANSACTIONS,
  SET_TRANSACTIONS,
  RESET_TRANSACTIONS,
  START_LOADING_TRANSACTIONS,
  STOP_LOADING_TRANSACTIONS,
} from '../constants/index'

export const refreshTransactions = () => ({
  type: REFRESH_TRANSACTIONS,
})

export const setTransactions = transactions => ({
  type: SET_TRANSACTIONS,
  payload: transactions,
})

export const resetTransactions = () => ({
  type: RESET_TRANSACTIONS,
})

export const startLoadingTransactions = () => ({
  type: START_LOADING_TRANSACTIONS,
})

export const stopLoadingTransactions = () => ({
  type: STOP_LOADING_TRANSACTIONS,
})
