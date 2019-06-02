import { DBTransaction, isPlaidTx } from './interfaces'
import { Transaction as PlaidTransaction } from 'plaid'

export const transactionDBConverter: (
  tx: DBTransaction | PlaidTransaction,
  userId?: number
) => DBTransaction | PlaidTransaction = (tx, userId) => {
  if (isPlaidTx(tx)) {
    // Omit location and payment_meta
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
    } = tx

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
  } else {
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
  }
}
