import {
  Iso8601DateString,
  Transaction as PlaidTransaction,
  Account as PlaidCard,
} from 'plaid'
import { DBTransaction } from './database/transactions'

//items
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
  username: string
  userId: number
}

export interface ContractCreateUser extends ContractLogin {}

//transactions
export interface ContractRetrieveTransactions {
  accounts: Array<PlaidCard>
  transactions: Array<PlaidTransaction>
}
