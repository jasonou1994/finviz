import { Router } from 'express'
import { addAccount, checkUpdateAuthToken, getUserId } from '../middleware'

export const accounts = Router()

accounts.post('/add', checkUpdateAuthToken, getUserId, addAccount)
