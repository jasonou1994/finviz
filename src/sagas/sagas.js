import { call, all, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  setTransactions,
  setAccounts,
  resetTransactions
} from "../actions/index";
import { FETCH_TRANSACTIONS } from "../constants";
import { getStartEndTimePairsForPastMonths, combineMonthData } from "../utils";

function* fetchTransactions(action) {
  const accessToken = action.payload;
  const dateArray = getStartEndTimePairsForPastMonths();

  try {
    yield put(resetTransactions());

    const responses = yield all(
      dateArray.map(date => {
        const { yesterday: start, today: end } = date;

        return call(fetch, "http://localhost:8000/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            accessToken,
            start,
            end
          })
        });
      })
    );
    const responseJsons = yield all(
      responses.map(res => {
        const bound = res.json.bind(res);
        return call(bound, res);
      })
    );

    const { transactions, accounts } = combineMonthData(responseJsons);

    yield put(setTransactions(transactions));
    yield put(setAccounts(accounts));
  } catch (e) {
    console.log("Error in fetchTransactions:", e);
  }
}

function* saga() {
  yield takeLatest(FETCH_TRANSACTIONS, fetchTransactions);
}

export default saga;
