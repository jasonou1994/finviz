import express, { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS, USERS } from '../constants'
import { dbClient } from '../database'
import { addAuthToken } from './auth'

export const user = Router()

user.post(
  '/create',
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const { username, password } = req.body

    try {
      const rows = await dbClient
        .select(['*'])
        .from(USERS)
        .where({ username })
      if (rows.length > 0) {
        throw 'Username already exists in database.'
      }

      const hash: string = await new Promise((resolve, reject) => {
        bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
          if (err) {
            reject(err)
            return
          }

          resolve(hash)
        })
      })

      await dbClient(USERS).insert({
        passwordHash: hash,
        username,
      })

      res.status(200).json({
        status: 'Successfully created new user.',
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error,
      })
    }
  },
  addAuthToken,
  (_, res: Response) => {
    res.end()
  }
)

user.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body

    try {
      const rows = await dbClient
        .select(['*'])
        .from(USERS)
        .where({ username })
      if (rows.length === 0) {
        throw 'Username or password does not match that of an existing user'
      }

      const { passwordHash } = rows[0]
      const authorized = await bcrypt.compare(password, passwordHash)
      if (!authorized) {
        throw 'Username or password does not match that of an existing user'
      }

      next()
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error,
      })
    }
  },
  addAuthToken,
  (_, res: Response) => {
    res.end()
  }
)

export const getUserId = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const { updatedToken } = res.locals

  try {
    const userId = await new Promise((resolve, reject) => {
      dbClient
        .select('id')
        .from(USERS)
        .where({ token: updatedToken })
        .limit(1)
        .then(rows => resolve(rows[0].id))
        .catch(err => reject(err))
    })

    res.locals.userId = userId
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}
