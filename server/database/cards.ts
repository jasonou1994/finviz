import { dbClient } from '../database'
import { CARDS } from '../constants'
import { Account as PlaidCard } from 'plaid'

export interface DBCard {
  account_id: string
  userId: number
  itemId: number
  mask: string | null
  name: string | null
  official_name: string | null
  subtype: string | null
  type: string | null
  available: number | null
  current: number | null
  credit_limit: number | null
  iso_currency_code: string | null
  official_currency_code: string | null
}

export const getCards: ({ userId }) => Promise<PlaidCard[]> = async ({
  userId,
}) => {
  const dbCards: DBCard[] = await dbClient
    .select('*')
    .from(CARDS)
    .where({ userId })

  return dbCards.map(dbCard => {
    const {
      userId,
      itemId,
      available,
      current,
      credit_limit,
      iso_currency_code,
      official_currency_code,
      ...sharedFields
    } = dbCard

    return {
      ...sharedFields,
      balances: {
        available,
        current,
        limit: credit_limit,
        iso_currency_code,
        official_currency_code,
      },
    }
  })
}

export const deleteCards: ({
  userId,
  itemId,
}: {
  userId: number
  itemId: number
}) => Promise<void> = async ({ userId, itemId }) => {
  await dbClient(CARDS)
    .where({ userId, itemId })
    .del()
}

export const insertCards: ({
  cards,
  userId,
  itemId,
}: {
  cards: PlaidCard[]
  userId: number
  itemId: number
}) => Promise<void> = async ({ cards, userId, itemId }) => {
  const dbCards: DBCard[] = cards.map(plaidCard => {
    const {
      balances: {
        available,
        current,
        limit: credit_limit,
        iso_currency_code,
        official_currency_code,
      },
      ...sharedFields
    } = plaidCard

    return {
      ...sharedFields,
      userId,
      itemId,
      available,
      current,
      credit_limit,
      iso_currency_code,
      official_currency_code,
    }
  })

  await dbClient(CARDS).insert(dbCards)
}
