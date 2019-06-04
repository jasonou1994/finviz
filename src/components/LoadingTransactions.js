import React, { Component } from 'react'
import { array, bool } from 'prop-types'
import '../../node_modules/react-vis/dist/style.css'
import { isEmpty } from 'lodash'
import { getAccountName } from '../reducers/transactions'
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  HorizontalBarSeries,
} from 'react-vis/dist'

export class LoadingTransactions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columnDefs: [
        {
          headerName: 'Account',
          field: 'account',
          sortable: true,
          filter: true,
        },
        {
          headerName: 'Transactions Found',
          field: 'txCount',
          sortable: true,
          filter: true,
        },
      ],
    }
  }

  getRowData = () => {
    const { transactionsNoIntraAccount, accounts } = this.props

    const accountCountMap = transactionsNoIntraAccount.reduce((acc, cur) => {
      const account = getAccountName({
        accounts,
        id: cur.account_id,
      })

      acc[account] ? acc[account]++ : (acc[account] = 1)

      return acc
    }, {})

    return Object.entries(accountCountMap).reduce((acc, cur) => {
      const [account, txCount] = cur
      acc.push({ account, txCount })
      return acc
    }, [])
  }

  getBarData = () => {
    const { transactionsNoIntraAccount, accounts } = this.props

    const accountCountMap = transactionsNoIntraAccount.reduce((acc, cur) => {
      const account = getAccountName({
        accounts,
        id: cur.account_id,
      })

      acc[account] ? acc[account]++ : (acc[account] = 1)

      return acc
    }, {})

    return Object.entries(accountCountMap).map(entry => {
      const [account, txCount] = entry
      return { y: account, x: txCount }
    })
  }

  render() {
    console.log(this.getBarData())
    const { transactionsNoIntraAccount, isLoading } = this.props

    return (
      <div>
        {isLoading ? <div>Loading transactions now...</div> : null}
        {!isEmpty(transactionsNoIntraAccount) ? (
          <>
            <div style={{ fontSize: '18px' }}>Transaction Count by Account</div>
            <XYPlot
              height={300}
              width={600}
              margin={{ left: 200, right: 10, top: 10, bottom: 30 }}
              yType="ordinal"
              animation={true}
            >
              <VerticalGridLines />
              <HorizontalGridLines />
              <HorizontalBarSeries data={this.getBarData()} />
              <XAxis />
              <YAxis />
            </XYPlot>
          </>
        ) : (
          <div
            style={{
              height: '300px',
              width: '600px',
              border: '1px solid black',
              display: 'flex',
              alignContent: 'center',
              alignItems: 'center',
            }}
          >
            <span style={{ width: '100%' }}>No transactions loaded yet.</span>
          </div>
        )}
      </div>
    )
  }
}
LoadingTransactions.propTypes = {
  accounts: array.isRequired,
  transactionsNoIntraAccount: array.isRequired,
  isLoading: bool.isRequired,
}
