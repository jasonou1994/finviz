import { client } from "./constants";

export const getTransactionsSSE = ({ accessTokens, start, end, res }) => {
  const tokenProms = accessTokens.map(token => {
    return new Promise(async (tokenResolve, tokenReject) => {
      let errorCount = 0;

      let completed = false;
      const txCount = 500;
      let txOffset = 0;

      while (!completed && errorCount < 3) {
        const options = {
          count: txCount,
          offset: txOffset
        };

        try {
          const { transactions, accounts } = await new Promise(
            (txResolve, txReject) => {
              client.getTransactions(
                token,
                start,
                end,
                options,
                (err, result) => {
                  result ? txResolve(result) : txReject(err);
                }
              );
            }
          );

          if (transactions.length !== 0) {
            res.write("event: transactions\n");
            res.write(`data: ${JSON.stringify(transactions)}\n\n`);

            txOffset += txCount;
          } else {
            completed = true;
          }

          res.write("event: accounts\n");
          res.write(`data: ${JSON.stringify(accounts)}\n\n`);

          console.log(
            `${transactions.length} transactions processed for token: ${token}`
          );
        } catch (err) {
          console.log("ERROR", err.error_code, err.error_message);
          errorCount++;
        }
      }

      errorCount < 20 ? tokenResolve() : tokenReject();
    });
  });

  Promise.all(tokenProms)
    .then(() => {
      res.write("id: CLOSE\n");
      res.write("event: success\n\n");
      res.end();
    })
    .catch(() => {
      res.write("id: CLOSE\n");
      res.write("event: error\n\n");
      res.end();
    });
};

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
