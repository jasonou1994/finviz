import { Transaction } from './interfaces'
import { Transaction as PlaidTransaction } from 'plaid'

export const parseTransactionDatabaseItems: (
  transactions: Array<PlaidTransaction>,
  userId: number
) => Array<Transaction> = (transactions, userId) => {
  return transactions.reduce((acc, currTx) => {
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
      address,
      city,
      state,
      zip,
      lat,
      lon,
      reference_number,
      ppd_id,
      payee,
    }

    acc.push(tx)

    return acc
  }, [])
}

export const mapDBTxToPlaidTx: (tx: Transaction) => any = tx => {
  const {
    address,
    city,
    state,
    zip,
    lat,
    lon,
    reference_number,
    ppd_id,
    payee,
    ...baseFields
  } = tx

  return {
    ...baseFields,
    location: { address, city, state, zip, lat, lon },
    payment_meta: { reference_number, ppd_id, payee },
  }
}
