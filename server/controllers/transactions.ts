import express, { Router } from 'express'

import { client, TRANSACTIONS, USERS, ACCOUNTS } from '../constants'
import { checkUpdateAuthToken } from './auth'
import { dbClient } from '../database'
import { getUserId } from './user'
import { NextFunction } from 'connect'

export const transactions = Router()

transactions.post(
  '/sse',
  checkUpdateAuthToken,
  getUserId,
  (req: express.Request, res: express.Response) => {
    console.log('In /transactions/sse POST endpoint.')
    const { accessTokens, start, end } = req.body
    const { userId } = res.locals

    res.header('Content-Type', 'text/event-stream')
    res.header('Cache-Control', 'no-cache')
    res.header('Connection', 'keep-alive')

    getTransactionsSSE({ accessTokens, start, end, res, userId })
    return
  }
)

export const refreshTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get list of accounts
  //for each account, refresh 2 years of data

  const accounts: Array<{
    id: string
    userId: string
  }> = await new Promise((resolve, reject) => {
    dbClient(ACCOUNTS)
      .select('id', 'userId')
      .then(rows => resolve(rows))
      .catch(err => reject(err))
  })
}

export const getTransactionsSSE = ({
  accessTokens,
  start,
  end,
  res,
  userId,
}) => {
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

            //also insert into DB
            await dbClient(TRANSACTIONS)
              .insert(
                transactions.map(tx => {
                  return { userId }
                })
              )
              .debug(true)

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

// export const getTransactions = async ({ accessTokens, start, end, res }) => {
//   const tokenProms = accessTokens.map(token => {
//     return new Promise(async (tokenResolve, tokenReject) => {
//       const transactionsArr = [];
//       let accountsArr = [];
//       let errorCount = 0;

//       let completed = false;
//       const txCount = 500;
//       let txOffset = 0;

//       while (!completed && errorCount < 3) {
//         const options = {
//           count: txCount,
//           offset: txOffset
//         };

//         try {
//           const { transactions, accounts } = await new Promise(
//             (txResolve, txReject) => {
//               client.getTransactions(
//                 token,
//                 start,
//                 end,
//                 options,
//                 (err, result) => {
//                   result ? txResolve(result) : txReject(err);
//                 }
//               );
//             }
//           );

//           if (transactions.length !== 0) {
//             transactionsArr.push(...transactions);
//             txOffset += txCount;
//           } else {
//             completed = true;
//           }

//           accountsArr = accounts.reduce((accounts, test) => {
//             if (
//               !accounts.find(
//                 existingAccount =>
//                   existingAccount.account_id === test.account_id
//               )
//             ) {
//               accounts.push(test);
//             }
//             return accounts;
//           }, accountsArr);
//         } catch (err) {
//           console.log("ERROR", err);
//           errorCount++;
//         }
//       }

//       errorCount < 20
//         ? tokenResolve({ transactions: transactionsArr, accounts: accountsArr })
//         : tokenReject({ error: `Too many errors in token: ${token}` });
//     });
//   });

//   try {
//     const results = await Promise.all(tokenProms);

//     return results.reduce(
//       (result, cur) => {
//         result.transactions.push(...cur.transactions);
//         result.accounts.push(...cur.accounts);

//         return result;
//       },
//       {
//         transactions: [],
//         accounts: []
//       }
//     );
//   } catch (err) {
//     console.log(err);
//     return err;
//   }
// };
