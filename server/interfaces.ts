import {
  Iso8601DateString,
  Transaction as PlaidTransaction,
  Account as PlaidCard,
} from 'plaid'

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
  userName: string
  userId: number
}

//transactions
export interface ContractRetrieveTransactions {
  accounts: Array<Account>
  transactions: Array<PlaidTransaction>
}

export interface DBTransaction {
  account_id: string
  account_owner: string | null
  amount: number | null
  iso_currency_code: string | null
  official_currency_code: string | null
  category: Array<string> | null
  category_id: string | null
  date: Iso8601DateString
  name: string | null
  pending: boolean | null
  pending_transaction_id: string | null
  transaction_id: string
  transaction_type: string | null
  userId: number
  address: string | null
  city: string | null
  lat: number | null
  lon: number | null
  state: string | null
  store_number: string | null
  zip: string | null
  by_order_of: string | null
  payee: string | null
  payer: string | null
  payment_method: string | null
  payment_processor: string | null
  ppd_id: string | null
  reason: string | null
  reference_number: string | null
}

export function isPlaidTx(
  tx: PlaidTransaction | DBTransaction
): tx is PlaidTransaction {
  return (<PlaidTransaction>tx).location !== undefined
}

//cards
export interface DBCard {
  account_id: string
  userId: number
  mask: string | null
  name: string | null
  official_name: string | null
  subtype: string | null
  type: string | null
  available: number | null
  current: number | null
  limit: number | null
  iso_currency_code: string | null
  official_currency_code: string | null
}

export function isPlaidCard(card: DBCard | PlaidCard): card is PlaidCard {
  return (<PlaidCard>card).balances !== undefined
}
