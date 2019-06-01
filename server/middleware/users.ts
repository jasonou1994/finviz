import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS, USERS, ACCOUNTS } from '../constants'
import { dbClient } from '../database'
import { Login } from '../interfaces'

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
}

export const processLogIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body

  try {
    const rows = await dbClient
      .select(['*'])
      .from(USERS)
      .where({ username })
    if (rows.length === 0) {
      throw 'Username or password does not match that of an existing user'
    }

    const { passwordHash, id } = rows[0]
    const authorized = await bcrypt.compare(password, passwordHash)
    if (!authorized) {
      throw 'Username or password does not match that of an existing user'
    }

    const accounts = await dbClient
      .select('id', 'lastUpdated', 'alias')
      .from(ACCOUNTS)
      .where({ userId: id })

    res.locals.userName = username
    res.locals.userId = id
    res.locals.accounts = accounts

    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}

export const sendLogInResponse = (_, res: Response) => {
  const { userName, userId, accounts } = res.locals

  const body: Login = {
    userName,
    userId,
    accounts,
  }
  res.json(body)
}

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

    next()
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}
