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
  REFRESH_TRANSACTIONS,
  FETCH_ADD_ACCOUNT,
  ACCOUNTS,
  TRANSACTIONS,
  FETCH_LOG_IN,
  LOG_IN,
  ACCOUNTS_ADD,
  RETRIEVE_TRANSACTIONS,
  LOG_OUT,
  FETCH_LOG_OUT,
} from '../constants'
import { parseSSEFields } from '../utils'
import { services } from '../services'

function* addAccount({ payload: publicToken }) {
  try {
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

function* refreshTransactions() {
  yield put(startLoadingTransactions())
  yield put(resetTransactions())
  try {
    const start = moment()
      .subtract(2, 'year')
      .format('YYYY-MM-DD')
    const end = moment().format('YYYY-MM-DD')

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
          default:
            break
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
    // 1. Attempt log in
    const login = yield call(services[LOG_IN], {
      body: JSON.stringify({
        username: user,
        password,
      }),
    })

    const { username, id, error } = yield login.json()
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

    // 2. Immediately request accounts + tx stored in DB
    const data = yield call(services[RETRIEVE_TRANSACTIONS], {
      body: JSON.stringify({}),
    })
    const { accounts, transactions } = yield data.json()

    console.log(accounts, transactions)
    yield put(setAccounts(accounts))
    yield put(setTransactions(transactions))
  } catch (error) {
    console.error('Problem in fetchLogIn:', error)
  }
}

function* fetchLogOut() {
  const logout = yield call(services[LOG_OUT], {
    body: JSON.stringify({}),
  })

  const { error } = yield logout.json()
  if (error) {
    throw error
  }

  yield put(setLoggedIn({ status: false }))
  yield put(
    setUserInfo({
      userName: '',
      userId: '',
    })
  )
}

function* saga() {
  yield takeLatest(REFRESH_TRANSACTIONS, refreshTransactions)
  yield takeLatest(FETCH_ADD_ACCOUNT, addAccount)
  yield takeLatest(FETCH_LOG_IN, fetchLogIn)
  yield takeLatest(FETCH_LOG_OUT, fetchLogOut)
}

function* fetchCreateUser() {}
export default saga
