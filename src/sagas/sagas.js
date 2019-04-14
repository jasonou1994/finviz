import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  setTransactions,
  setAccounts,
  resetTransactions
} from "../actions/index";
import { FETCH_TRANSACTIONS } from "../constants";
import { getStartEndTimePairsForPastDays } from "../utils";

function* fetchTransactions(action) {
  const accessToken = action.payload;
  const dateArray = getStartEndTimePairsForPastDays(10);
  console.log(dateArray);
  // try {
  //   yield put(resetTransactions());
  //   const response = yield call(fetch, "http://localhost:8000/transactions", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       accessToken
  //     })
  //   });
  //   const { transactions, accounts } = yield response.json();
  //   yield put(setTransactions(transactions));
  //   yield put(setAccounts(accounts));
  // } catch (e) {}
}

function* saga() {
  yield takeLatest(FETCH_TRANSACTIONS, fetchTransactions);
}

export default saga;
