import { Router } from 'express'
import {
  createUser,
  sendEmptyResponse,
  addAuthToken,
  processLogIn,
  sendLogInResponse,
} from '../middleware'

export const user = Router()

user.post('/create', createUser, addAuthToken, sendEmptyResponse)

user.post('/login', processLogIn, addAuthToken, sendLogInResponse)
