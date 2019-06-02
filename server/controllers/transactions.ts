import { Router } from 'express'
import {
  refreshTransactionsSSE,
  checkUpdateAuthToken,
  getUserId,
  retrieveTransactions,
} from '../middleware'

export const transactions = Router()

transactions.post(
  '/refresh',
  checkUpdateAuthToken,
  getUserId,
  refreshTransactionsSSE
)

transactions.post(
  '/retrieve',
  checkUpdateAuthToken,
  getUserId,
  retrieveTransactions
)
