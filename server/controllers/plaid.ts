import { Router } from 'express'
import { getAccessToken } from '../middleware'

export const plaid = Router()

plaid.post('/get_access_token', getAccessToken)
