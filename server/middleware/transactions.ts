import { Request, Response } from 'express'
import { dbClient } from '../database'
import {
  ACCOUNTS,
  client,
  TRANSACTIONS,
  TRANSACTIONS_LOCATIONS,
  TRANSACTIONS_PAYMENT_META,
} from '../constants'
import { parseTransactionDatabaseItems } from '../utils'

export const refreshTransactionsSSE = async (req: Request, res: Response) => {
  console.log('In /transactions/sse POST endpoint.')
  const { start, end } = req.body
  const { userId } = res.locals

  res.header('Content-Type', 'text/event-stream')
  res.header('Cache-Control', 'no-cache')
  res.header('Connection', 'keep-alive')

  await dbClient(TRANSACTIONS)
    .where({ userId })
    .del()

  const accessTokens: [] = await new Promise((resolve, reject) => {
    dbClient
      .select('accessToken')
      .from(ACCOUNTS)
      .where({ userId })
      .then(rows => resolve(rows.map(row => row.accessToken)))
      .catch(err => reject(err))
  })

  const tokenProms = accessTokens.map(token => {
    return new Promise(async (tokenResolve, tokenReject) => {
      let errorCount = 0

      let completed = false
      const txCount = 500
      let txOffset = 0

      while (!completed && errorCount < 3) {
        const options = {
          count: txCount,
          offset: txOffset,
        }

        try {
          const { transactions, accounts } = await new Promise(
            (txResolve, txReject) => {
              client.getTransactions(
                token,
                start,
                end,
                options,
                (err, result) => {
                  result ? txResolve(result) : txReject(err)
                }
              )
            }
          )

          if (transactions.length !== 0) {
            res.write('event: transactions\n')
            res.write(`data: ${JSON.stringify(transactions)}\n\n`)

            const {
              dbTxs,
              dbTxLocations,
              dbTxPaymentMetas,
            } = parseTransactionDatabaseItems(transactions, userId)

            await dbClient(TRANSACTIONS).insert(dbTxs)
            await dbClient(TRANSACTIONS_LOCATIONS).insert(dbTxLocations)
            await dbClient(TRANSACTIONS_PAYMENT_META).insert(dbTxPaymentMetas)

            txOffset += txCount
          } else {
            completed = true
          }

          res.write('event: accounts\n')
          res.write(`data: ${JSON.stringify(accounts)}\n\n`)

          console.log(
            `${transactions.length} transactions processed for token: ${token}`
          )
        } catch (err) {
          console.log('ERROR', err.error_code, err.error_message)
          errorCount++
        }
      }

      errorCount < 20 ? tokenResolve() : tokenReject()
    })
  })

  Promise.all(tokenProms)
    .then(() => {
      res.write('id: CLOSE\n')
      res.write('event: success\n\n')
      res.end()
    })
    .catch(() => {
      res.write('id: CLOSE\n')
      res.write('event: error\n\n')
      res.end()
    })
}
