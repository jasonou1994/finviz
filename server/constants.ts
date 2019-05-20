import { Client, environments } from 'plaid'

const PLAID_CLIENT_ID = '5c52345ce341ed0010a522f1'
const PLAID_SECRET = '259a3db7aec2d3314a6e545d056a10'
const PLAID_PUBLIC_KEY = '134893e5d974bced3a52c91e8e6b5a'
const PLAID_ENV = 'development'

export const client = new Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  environments[PLAID_ENV],
  { version: '2018-05-22' }
)

export const connection = {
  host: 'localhost',
  user: 'jasonou',
  password: '',
  database: 'pilea',
}

//Password
export const SALT_ROUNDS = 10

//DB
export const USERS = 'users'
export const ACCOUNTS = 'accounts'
export const TRANSACTIONS = 'transactions'

//jwt
export const key = 'jasonou1'
