import { Request, Response } from 'express'
import { dbClient } from '../database'
import { ITEMS, client } from '../constants'
import { ContractAccountsAdd } from '../interfaces'
import { plaidGetAccessToken } from '../plaidAPI'

export const addAccount = async (req: Request, res: Response) => {
  const { userId } = res.locals
  const { alias, publicToken } = req.body

  try {
    const accessToken = await plaidGetAccessToken({ publicToken })
    await dbClient(ITEMS).insert({ userId, accessToken, alias })

    const accounts = await dbClient(ITEMS)
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
