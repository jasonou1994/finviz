import { dbClient } from '../database'
import { ITEMS } from '../constants'

export interface DBItem {
  id: number
  userId: number
  accessToken: string
  lastUpdated: string
  alias?: string
}

export const getItems: ({ userId }) => Promise<DBItem[]> = async ({ userId }) =>
  new Promise((resolve, reject) => {
    dbClient
      .select(['id', 'accessToken'])
      .from(ITEMS)
      .where({ userId })
      .then(rows => resolve(rows))
      .catch(err => reject(err))
  })
