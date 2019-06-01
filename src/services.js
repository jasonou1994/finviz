import { ACCOUNTS_ADD, REFRESH_TRANSACTIONS, LOG_IN } from './constants'

const serviceDefs = [
  {
    name: ACCOUNTS_ADD,
    url: 'http://localhost:8000/accounts/add',
  },
  {
    name: REFRESH_TRANSACTIONS,
    url: 'http://localhost:8000/transactions/sse',
  },
  {
    name: LOG_IN,
    url: 'http://localhost:8000/user/login',
  },
]

const defaultOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
}

export const services = serviceDefs.reduce((acc, service) => {
  const { name, url, options } = service

  const newOptions = { ...defaultOptions, ...options }

  acc[name] = async ({ body }) => {
    return new Promise((resolve, reject) => {
      fetch(url, { ...newOptions, body })
        .then(response => resolve(response))
        .catch(err => reject(err))
    })
  }

  return acc
}, {})
