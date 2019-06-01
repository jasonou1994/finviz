type accounts = Array<{
  id: number
  lastUpdated: string
  alias: string
}>

//accounts
export interface ContractAccountsAdd {
  status: string
  accounts: accounts
}

//users
export interface Login {
  userName: string
  userId: number
  accounts: accounts
}

//transactions
export interface Transaction {
  transaction_id: string
  userId: number
  account_id: string
  category: string
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
}

export interface TransactionLocation {
  address: string
  city: string
  region: string
  postal_code: string
  country: string
  lat: number
  lon: number
  transaction_id: string
}

export interface TransactionPaymentMeta {
  transaction_id: string
  reference_number: string
  ppd_id: string
  payee_name: string
}
