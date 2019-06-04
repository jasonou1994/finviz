import { Request, Response } from 'express'
import { dbClient } from '../database'
import { ITEMS, client, TRANSACTIONS, CARDS } from '../constants'
import { transactionDBConverter, cardDBConverter } from '../utils'
import { Account, ContractRetrieveTransactions } from '../interfaces'
import { Transaction as PlaidTransaction, Account as PlaidCard } from 'plaid'

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

  const items: [] = await new Promise((resolve, reject) => {
    dbClient
      .select(['id', 'accessToken'])
      .from(ITEMS)
      .where({ userId })
      .then(rows => resolve(rows))
      .catch(err => reject(err))
  })

  const tokenProms = items.map(item => {
    const { accessToken: token, id: itemId } = item

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
            const dbTxs = transactions.map(tx =>
              transactionDBConverter(tx, userId)
            )
            await dbClient(TRANSACTIONS).insert(dbTxs)

            res.write('event: transactions\n')
            res.write(`data: ${JSON.stringify(transactions)}\n\n`)

            txOffset += txCount
          } else {
            completed = true
          }

          if (accounts.length !== 0) {
            await dbClient(CARDS)
              .where({ userId, itemId })
              .del()
            const dbCards = accounts.map(card =>
              cardDBConverter(card, userId, itemId)
            )
            await dbClient(CARDS).insert(dbCards)

            res.write('event: accounts\n')
            res.write(`data: ${JSON.stringify(accounts)}\n\n`)
          }

          console.log(
            `${transactions.length} transactions processed for token: ${token}`
          )
        } catch (err) {
          console.log('ERROR', err)
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

export const retrieveTransactions = async (_: Request, res: Response) => {
  const { userId } = res.locals

  const accounts: Array<PlaidCard> = await new Promise((resolve, reject) => {
    dbClient
      .select('*')
      .from(CARDS)
      .where({ userId })
      .then(cards => resolve(cards.map(card => cardDBConverter(card))))
      .catch(err => reject(err))
  })

  const transactions: Array<PlaidTransaction> = await new Promise(
    (resolve, reject) => {
      dbClient
        .select('*')
        .from(TRANSACTIONS)
        .where({ userId })
        .then(txs => resolve(txs.map(tx => transactionDBConverter(tx))))
        .catch(err => reject(err))
    }
  )

  const resBody: ContractRetrieveTransactions = {
    accounts,
    transactions,
  }

  res.json(resBody)
}
