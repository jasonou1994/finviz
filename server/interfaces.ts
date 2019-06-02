import { Transaction as PlaidTransaction } from 'plaid'

//accounts
export interface Account {
  id: number
  lastUpdated: string
  alias: string
}

export interface ContractAccountsAdd {
  status: string
  accounts: Array<Account>
}

//users
export interface ContractLogin {
  userName: string
  userId: number
}

//transactions
export interface ContractRetrieveTransactions {
  accounts: Array<Account>
  transactions: Array<PlaidTransaction>
}

export interface Transaction {
  transaction_id: string
  userId: number
  account_id: string
  category: string[]
  category_id: string
  transaction_type: string
  name: string
  account: number
  iso_currency_code: string
  unofficial_currency_code: string
  date: string
  pending: boolean
  pending_transaction_id: string
  account_owner: string
  address: string
  city: string
  state: string
  zip: string
  lat: number
  lon: number
  reference_number: string
  ppd_id: string
  payee: string
}
