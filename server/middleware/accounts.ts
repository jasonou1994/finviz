import { Request, Response } from 'express'
import { dbClient } from '../database'
import { ACCOUNTS, client } from '../constants'
import { ContractAccountsAdd } from '../interfaces'

export const addAccount = async (req: Request, res: Response) => {
  const { userId } = res.locals
  const { alias, publicToken } = req.body

  try {
    const accessToken = await new Promise((resolve, reject) => {
      client.exchangePublicToken(publicToken, (err, tokenResponse) => {
        if (err) {
          reject(err)
        }

        const { access_token } = tokenResponse

        resolve(access_token)
      })
    })

    await dbClient(ACCOUNTS).insert({ userId, accessToken, alias })

    const accounts = await dbClient(ACCOUNTS)
      .select(['alias', 'id', 'lastUpdated'])
      .where({ userId })

    const resBody: ContractAccountsAdd = {
      status: 'Successfully added account',
      accounts: accounts.map(row => {
        const { id, lastUpdated, alias } = row
        return { id, lastUpdated, alias }
      }),
    }

    res.json(resBody)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error,
    })
  }
}
