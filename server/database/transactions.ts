import { dbClient } from '../database'
import { TRANSACTIONS } from '../constants'
import {
  Iso8601DateString,
  Transaction as PlaidTransaction,
  Account as PlaidCard,
  TransactionsResponse,
} from 'plaid'

export interface DBTransaction {
  account_id: string
  account_owner: string | null
  amount: number | null
  iso_currency_code: string | null
  official_currency_code: string | null
  category: Array<string> | null
  category_id: string | null
  date: Iso8601DateString
  name: string | null
  pending: boolean | null
  pending_transaction_id: string | null
  transaction_id: string
  transaction_type: string | null
  userId: number
  address: string | null
  city: string | null
  lat: number | null
  lon: number | null
  state: string | null
  store_number: string | null
  zip: string | null
  by_order_of: string | null
  payee: string | null
  payer: string | null
  payment_method: string | null
  payment_processor: string | null
  ppd_id: string | null
  reason: string | null
  reference_number: string | null
}

export const getTransactions: ({
  userId,
}) => Promise<PlaidTransaction[]> = async ({ userId }) => {
  const dbTransactions: DBTransaction[] = await dbClient
    .select('*')
    .from(TRANSACTIONS)
    .where({ userId })

  return dbTransactions.map(tx => {
    const {
      userId: _,
      address,
      city,
      state,
      zip,
      lat,
      lon,
      store_number,
      by_order_of,
      payee,
      payer,
      payment_method,
      payment_processor,
      ppd_id,
      reason,
      reference_number,
      ...sharedFields
    } = tx

    return {
      ...sharedFields,
      location: { address, city, state, zip, lat, lon, store_number },
      payment_meta: {
        by_order_of,
        payee,
        payer,
        payment_method,
        payment_processor,
        ppd_id,
        reason,
        reference_number,
      },
    }
  })
}

export const deleteTransactions: ({ userId }) => Promise<void> = async ({
  userId,
}) => {
  dbClient(TRANSACTIONS)
    .where({ userId })
    .del()
}

export const insertTransactions: ({
  plaidTransactions,
  userId,
}: {
  plaidTransactions: PlaidTransaction[]
  userId: number
}) => Promise<void> = async ({ plaidTransactions, userId }) => {
  const dbTransactions: DBTransaction[] = plaidTransactions.map(plaidTx => {
    const {
      location: { address, city, state, zip, lat, lon, store_number },
      payment_meta: {
        by_order_of,
        payee,
        payer,
        payment_method,
        payment_processor,
        ppd_id,
        reason,
        reference_number,
      },
      ...sharedFields
    } = plaidTx

    return {
      ...sharedFields,
      userId,
      address,
      city,
      state,
      zip,
      lat,
      lon,
      store_number,
      by_order_of,
      payee,
      payer,
      payment_method,
      payment_processor,
      ppd_id,
      reason,
      reference_number,
    }
  })

  await dbClient(TRANSACTIONS).insert(dbTransactions)
}
