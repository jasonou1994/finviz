import { DBTransaction, isPlaidTx, DBCard, isPlaidCard } from './interfaces'
import { Transaction as PlaidTransaction, Account as PlaidCard } from 'plaid'

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

export const cardDBConverter: (
  card: DBCard | PlaidCard,
  userId?: number,
  itemId?: number
) => DBCard | PlaidCard = (card, userId, itemId) => {
  if (isPlaidCard(card)) {
    const {
      balances: {
        available,
        current,
        limit,
        iso_currency_code,
        official_currency_code,
      },
      ...sharedFields
    } = card

    return {
      ...sharedFields,
      userId,
      itemId,
      available,
      current,
      limit,
      iso_currency_code,
      official_currency_code,
    }
  } else {
    const {
      userId,
      itemId,
      available,
      current,
      limit,
      iso_currency_code,
      official_currency_code,
      ...sharedFields
    } = card

    return {
      ...sharedFields,
      balances: {
        available,
        current,
        limit,
        iso_currency_code,
        official_currency_code,
      },
    }
  }
}
