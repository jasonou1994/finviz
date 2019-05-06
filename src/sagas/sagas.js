import { call, all, put, takeLatest } from "redux-saga/effects";
import {
  setTransactions,
  setAccounts,
  resetTransactions,
  setAccessToken
} from "../actions/index";
import { FETCH_TRANSACTIONS, FETCH_ACCESS_TOKEN } from "../constants";
import { getStartEndTimePairsForPastMonths, combineMonthData } from "../utils";

function* getPublicToken({ payload: publicToken }) {
  try {
    const res = yield call(fetch, "http://localhost:8000/get_access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        public_token: publicToken
      })
    });
    const {
      access_token: accessToken,
      item_id: itemId,
      error
    } = yield res.json();

    if (error) {
      console.error("Server error in getPublicToken:", error);
      return;
    }
    yield put(setAccessToken({ accessToken, itemId }));
  } catch (e) {
    console.error("Problem in getPublicToken:", e);
  }
}

function* fetchTransactions({ payload: { accessTokens } }) {
  const dateArray = getStartEndTimePairsForPastMonths();

  try {
    yield put(resetTransactions());

    const responses = yield all(
      dateArray.reduce((acc, date) => {
        const { yesterday: start, today: end } = date;

        accessTokens.forEach(accessToken => {
          acc.push(
            call(fetch, "http://localhost:8000/transactions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                accessToken,
                start,
                end
              })
            })
          );
        });

        return acc;
      }, [])
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
    console.error("Error in fetchTransactions:", e);
  }
}

function* saga() {
  yield takeLatest(FETCH_TRANSACTIONS, fetchTransactions);
  yield takeLatest(FETCH_ACCESS_TOKEN, getPublicToken);
}

export default saga;
