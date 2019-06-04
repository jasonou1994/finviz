import { Response } from 'express'

export * from './accounts'
export * from './auth'
export * from './plaid'
export * from './transactions'
export * from './users'

export const sendEmptyResponse = (_, res: Response) => {
  res.json({})
}
