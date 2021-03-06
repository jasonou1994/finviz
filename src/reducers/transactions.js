import { Map, List, Set } from 'immutable'
import { createSelector } from 'reselect'
import {
  SET_TRANSACTIONS,
  SET_ACCOUNTS,
  TRANSACTIONS,
  ACCOUNTS,
  RESET_TRANSACTIONS,
  AMOUNT,
  CATEGORY,
  NAME,
  IS_LOADING,
  START_LOADING_TRANSACTIONS,
  STOP_LOADING_TRANSACTIONS,
} from '../constants'
import { shouldKeepTransaction } from '../utils'

const initialState = Map({
  [TRANSACTIONS]: List(),
  [ACCOUNTS]: List(),
  [IS_LOADING]: false,
})

export default function transactions(state = initialState, action) {
  const { type, payload } = action
  let newState

  switch (type) {
    case SET_TRANSACTIONS: {
      newState = state.updateIn([TRANSACTIONS], list => list.push(...payload))
      break
    }
    case SET_ACCOUNTS: {
      newState = state.updateIn([ACCOUNTS], accounts => {
        return payload.reduce((accounts, testAccount) => {
          if (
            !accounts.find(
              existingAccount =>
                existingAccount.account_id === testAccount.account_id
            )
          ) {
            accounts = accounts.push(testAccount)
          }
          return accounts
        }, accounts)
      })
      break
    }
    case RESET_TRANSACTIONS: {
      newState = state.set(TRANSACTIONS, List())
      break
    }
    case START_LOADING_TRANSACTIONS: {
      newState = state.set(IS_LOADING, true)
      break
    }
    case STOP_LOADING_TRANSACTIONS: {
      newState = state.set(IS_LOADING, false)
      break
    }
    default: {
      newState = state
    }
  }

  return newState
}
export const getTypeOfAccount = ({ accounts, id }) => {
  const account = accounts.find(account => account.account_id === id)

  return account ? account.type : null
}
export const getAccountName = ({ accounts, id }) => {
  const account = accounts.find(account => account.account_id === id)

  return account
    ? account.official_name
      ? account.official_name
      : account.name
    : null
}

export const transactionsSelector = state => state.get(TRANSACTIONS)
export const accountsSelector = state => state.get(ACCOUNTS)
export const isLoadingSelector = state => state.get(IS_LOADING)

export const transactionsNoIntraAccountSelector = createSelector(
  transactionsSelector,
  accountsSelector,
  (transactions, accounts) => {
    return transactions
      .map(tx => ({
        ...tx,
        accountType: getTypeOfAccount({
          id: tx.account_id,
          accounts,
        }),
      }))
      .filter(({ accountType, ...tx }) => {
        return shouldKeepTransaction(tx, accountType)
      })
  }
)

export const dailyTransactionsSelector = createSelector(
  transactionsNoIntraAccountSelector,
  transactions => {
    const uniqueDates = [...new Set(transactions.map(tx => tx.date))].reduce(
      (acc, cur) => {
        acc[cur] = []
        return acc
      },
      {}
    )
    const txByDates = transactions.reduce((acc, cur) => {
      const { date } = cur

      acc[date].push(cur)
      return acc
    }, uniqueDates)

    return txByDates
  }
)

export const transactionsByDateInputOutputSelector = createSelector(
  dailyTransactionsSelector,
  transactions => {
    return Object.keys(transactions).reduce((finalResult, date) => {
      finalResult[date] = transactions[date].reduce(
        (dailyInfo, tx) => {
          const { accountType, amount } = tx

          if (accountType === 'credit' && amount >= 0) {
            dailyInfo.output += amount
          }
          if (accountType === 'credit' && amount <= 0) {
            dailyInfo.input += -amount
          }
          if (accountType === 'depository' && amount >= 0) {
            dailyInfo.output += amount
          }
          if (accountType === 'depository' && amount <= 0) {
            dailyInfo.input += -amount
          }

          dailyInfo.transactions.push(tx)

          return dailyInfo
        },
        {
          input: 0,
          output: 0,
          transactions: [],
        }
      )
      return finalResult
    }, {})
  }
)

export const transactionsByCategorySelector = createSelector(
  transactionsNoIntraAccountSelector,
  transactions =>
    transactions.reduce((acc, cur) => {
      if (!cur[CATEGORY]) {
        return acc
      }

      const category = cur[CATEGORY][0]

      if (acc[category]) {
        acc[category][AMOUNT] += cur[AMOUNT]
        acc[category][TRANSACTIONS].push(cur)
      } else {
        acc[category] = {
          [AMOUNT]: cur[AMOUNT],
          [TRANSACTIONS]: [cur],
        }
      }

      return acc
    }, {})
)

export const transactionsByNameSelector = createSelector(
  transactionsNoIntraAccountSelector,
  transactions =>
    transactions.reduce((acc, cur) => {
      if (!cur[NAME]) {
        return acc
      }

      const name = cur[NAME]

      if (acc[name]) {
        acc[name][AMOUNT] += cur[AMOUNT]
        acc[name][TRANSACTIONS].push(cur)
      } else {
        acc[name] = {
          [AMOUNT]: cur[AMOUNT],
          [TRANSACTIONS]: [cur],
        }
      }

      return acc
    }, {})
)

export const transactionsByAccountsSelector = createSelector(
  dailyTransactionsSelector,
  transactions => {
    return Object.keys(transactions).reduce((result, date) => {
      result[date] = transactions[date].reduce((acc, cur) => {
        acc[cur.account_id]
          ? acc[cur.account_id].push(cur)
          : (acc[cur.account_id] = [cur])
        return acc
      }, {})

      return result
    }, {})
  }
)
