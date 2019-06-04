import { Router, Request, Response, NextFunction } from 'express'
import { USERS, key } from '../constants'
import jwt from 'jsonwebtoken'
import { dbClient } from '../database'
import uuidv4 from 'uuidv4'

export const auth = Router()

export const addAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.body

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { acc: 'total' },
      },
      key
    )
    await dbClient(USERS)
      .update({ token })
      .where({ username })

    res.cookie('Authorization', token)
    res.locals.updatedToken = token
    console.log('Adding token...', token)

    next()
  } catch (error) {
    res.status(500).json({
      error,
    })
  }
}

export const checkUpdateAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Checking token...')
  try {
    const authorization = req.cookies.Authorization

    // 1. Check token exists.
    if (!authorization) {
      throw 'No Authorization: Bearer header present on request'
    }

    // 2. Check token exists in DB.
    const rows = await dbClient(USERS)
      .where({ token: authorization })
      .count('*')
    if (rows[0].count === '0') {
      throw 'Invalid Authorization: Bearer token on request'
    }

    // 3. Check JWT properly signed.
    jwt.verify(authorization, key)

    // 4. Accepted token - refresh in DB and client.
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { acc: 'total' },
      },
      key
    )

    console.log('Ok: ', token)

    await dbClient(USERS)
      .update({ token })
      .where({ token: authorization })

    res.cookie('Authorization', token)
    res.locals.updatedToken = token

    next()
  } catch (error) {
    console.log('Cannot validate token.')
    res.status(401).json({
      error,
    })
  }
}

export const checkDeleteAuthToken: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = async (req, res, next) => {
  try {
    const authorization = req.cookies.Authorization

    // 1. Check token exists.
    if (!authorization) {
      throw 'No Authorization: Bearer header present on request'
    }

    // 2. Check token exists in DB.
    const rows = await dbClient(USERS)
      .where({ token: authorization })
      .count('*')
    if (rows[0].count === '0') {
      throw 'Invalid Authorization: Bearer token on request'
    }

    // 3. Check JWT properly signed.
    jwt.verify(authorization, key)

    // 4. Replace in DB with random string
    await dbClient(USERS)
      .update({ token: uuidv4() })
      .where({ token: authorization })

    next()
  } catch (error) {
    res.status(500).json({ error })
  }
}
