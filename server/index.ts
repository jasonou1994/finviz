import express, { Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { transactions } from './controllers/transactions'
import { plaid } from './controllers/plaid'
import { user } from './controllers/user'
import { accounts } from './controllers/accounts'

const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(function(_, res: Response, next: NextFunction) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

app.use('/transactions', transactions)
app.use('/plaid', plaid)
app.use('/user', user)
app.use('/accounts', accounts)

app.listen(8000, () => {
  console.log('Express server listening on 8000.')
})
