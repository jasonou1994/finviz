import {
  Transaction,
  TransactionLocation,
  TransactionPaymentMeta,
} from './interfaces'
import { Transaction as PlaidTransaction } from 'plaid'

export const parseTransactionDatabaseItems: (
  transactions: Array<PlaidTransaction>,
  userId: number
) => {
  dbTxs: Array<Transaction>
  dbTxLocations: Array<TransactionLocation>
  dbTxPaymentMetas: Array<TransactionPaymentMeta>
} = (transactions, userId) => {
  return transactions.reduce(
    (acc, currTx) => {
      const {
        transaction_id,
        account_id,
        category,
        category_id,
        transaction_type,
        name,
        amount,
        iso_currency_code,
        date,
        pending,
        pending_transaction_id,
        account_owner,
        location: { address, city, state, zip, lat, lon },
        payment_meta: { reference_number, ppd_id, payee },
      } = currTx

      const tx = {
        transaction_id,
        userId,
        account_id,
        category,
        category_id,
        transaction_type,
        name,
        amount,
        iso_currency_code,
        date,
        pending,
        pending_transaction_id,
        account_owner,
      }

      const location = {
        address,
        city,
        state,
        zip,
        lat,
        lon,
        transaction_id,
      }

      const paymentMeta = {
        transaction_id,
        reference_number,
        ppd_id,
        payee,
      }

      acc.dbTxs.push(tx)
      acc.dbTxLocations.push(location)
      acc.dbTxPaymentMetas.push(paymentMeta)

      return acc
    },
    {
      dbTxs: [],
      dbTxLocations: [],
      dbTxPaymentMetas: [],
    }
  )
}
