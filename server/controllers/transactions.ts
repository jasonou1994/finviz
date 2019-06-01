import { Router } from 'express'
import {
  refreshTransactionsSSE,
  checkUpdateAuthToken,
  getUserId,
} from '../middleware'

export const transactions = Router()

transactions.post(
  '/sse',
  checkUpdateAuthToken,
  getUserId,
  refreshTransactionsSSE
)
