import { Router, Request, Response, NextFunction } from 'express'
import { dbClient } from '../database'
import { USERS, ACCOUNTS } from '../constants'
import { checkUpdateAuthToken } from './auth'
import { getUserId } from './user'

export const accounts = Router()

accounts.post(
  '/add',
  checkUpdateAuthToken,
  getUserId,
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = res.locals
    const { accessToken } = req.body

    try {
      await dbClient(ACCOUNTS)
        .insert({ userId, accessToken })
        .debug(true)

      res.status(200).json({
        status: 'Successfully added account',
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error,
      })
    }
  }
)
