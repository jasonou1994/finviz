import { call, put, takeLatest } from 'redux-saga/effects'
import moment from 'moment'
import {
  setTransactions,
  setAccounts,
  resetTransactions,
  startLoadingTransactions,
  stopLoadingTransactions,
  setLoggedIn,
  setUserInfo,
} from '../actions'
import {
  FETCH_TRANSACTIONS,
  FETCH_ADD_ACCOUNT,
  ACCOUNTS,
  TRANSACTIONS,
  FETCH_LOG_IN,
  LOG_IN,
  REFRESH_TRANSACTIONS,
  ACCOUNTS_ADD,
} from '../constants'
import { parseSSEFields } from '../utils'
import { services } from '../services'

function* addAccount({ payload: publicToken }) {
  try {
    // const res = yield call(fetch, 'http://localhost:8000/accounts/add', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     publicToken,
    //     alias: 'noalias',
    //     lastUpdated: 'never',
    //   }),
    //   credentials: 'include',
    // })
    const res = yield call(services[ACCOUNTS_ADD], {
      body: JSON.stringify({
        publicToken,
        alias: 'noalias',
        lastUpdated: 'never',
      }),
    })

    const { error } = yield res.json()

    if (error) {
      console.error('Server error in getPublicToken:', error)
      return
    }
  } catch (e) {
    console.error('Problem in getPublicToken:', e)
  }
}

function* fetchTransactions({ payload: { accessTokens } }) {
  yield put(startLoadingTransactions())
  yield put(resetTransactions())
  try {
    const start = moment()
      .subtract(2, 'year')
      .format('YYYY-MM-DD')
    const end = moment().format('YYYY-MM-DD')
    // const res = yield call(fetch, 'http://localhost:8000/transactions/sse', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     start,
    //     end,
    //   }),
    //   credentials: 'include',
    // })

    const res = yield call(services[REFRESH_TRANSACTIONS], {
      body: JSON.stringify({
        start,
        end,
      }),
    })

    const reader = yield res.body.getReader()
    const decoder = yield new TextDecoder('utf-8')

    let complete = false
    let dataString = ''

    while (!complete) {
      const chunk = yield reader.read()
      dataString += yield decoder.decode(chunk.value)

      const possibleEventArr = dataString.split(/\n\n/g)
      let eventsFound = 0

      for (const [i, message] of possibleEventArr.entries()) {
        if (i === possibleEventArr.length - 1) {
          continue
        }

        eventsFound++
        const { id, data, event } = parseSSEFields(message)

        if (id === 'CLOSE') {
          complete = true
        }

        switch (event) {
          case ACCOUNTS: {
            yield put(setAccounts(JSON.parse(data)))
            break
          }
          case TRANSACTIONS: {
            yield put(setTransactions(JSON.parse(data)))
            break
          }
        }
      }
      possibleEventArr.splice(0, eventsFound)
      dataString = possibleEventArr.join('\n\n')
    }
  } catch (e) {
    console.error('Error in fetchTransactions:', e)
  }

  yield put(stopLoadingTransactions())
}

function* fetchLogIn({ payload: { user, password } }) {
  try {
    // const res = yield call(fetch, 'http://localhost:8000/user/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     username: user,
    //     password,
    //   }),
    //   credentials: 'include',
    // })

    const res = yield call(services[LOG_IN], {
      body: JSON.stringify({
        username: user,
        password,
      }),
    })

    const { username, id, error } = yield res.json()
    if (error) {
      throw error
    }

    yield put(setLoggedIn({ status: true }))
    yield put(
      setUserInfo({
        userName: username,
        userId: id,
      })
    )
  } catch (error) {
    console.error('Problem in fetchLogIn:', error)
  }
}

function* saga() {
  yield takeLatest(FETCH_TRANSACTIONS, fetchTransactions)
  yield takeLatest(FETCH_ADD_ACCOUNT, addAccount)
  yield takeLatest(FETCH_LOG_IN, fetchLogIn)
}

export default saga
