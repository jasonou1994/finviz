import { Router } from 'express'
import {
  createUser,
  sendEmptyResponse,
  addAuthToken,
  processLogIn,
  sendLogInResponse,
  checkDeleteAuthToken,
  sendCreateUserResponse,
  getUserId,
} from '../middleware'

export const user = Router()

user.post(
  '/create',
  createUser,
  addAuthToken,
  getUserId,
  sendCreateUserResponse
)

user.post('/login', processLogIn, addAuthToken, sendLogInResponse)

user.post('/logout', checkDeleteAuthToken, sendEmptyResponse)
