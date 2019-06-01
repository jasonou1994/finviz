import { Request, Response } from 'express'
import { client } from '../constants'

export const getAccessToken = (req: Request, res: Response) => {
  const { public_token: PUBLIC_TOKEN } = req.body
  console.log(PUBLIC_TOKEN)
  client.exchangePublicToken(PUBLIC_TOKEN, (err, tokenResponse) => {
    console.log(err, tokenResponse)
    if (err) {
      return res.json({ err })
    }

    const { access_token: ACCESS_TOKEN, item_id: ITEM_ID } = tokenResponse
    res.json({
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
      error: null,
    })
  })
}
