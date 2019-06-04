import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addAccount, refreshTransactions, fetchLogOut } from '../actions'
import PropTypes from 'prop-types'
import PlaidLink from 'react-plaid-link'
import { list } from 'react-immutable-proptypes'
import {
  accountsSelector,
  isLoadingSelector,
  loggedInSelector,
} from '../reducers'
import GraphContainer from './GraphContainer'
import GridContainer from './GridContainer'
import LoadingContainer from './LoadingContainer'
import LogInContainer from './LogInContainer'

class _App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      PLAID_PUBLIC_KEY: '134893e5d974bced3a52c91e8e6b5a',
      PLAID_ENV: 'development',
    }
  }

  render() {
    const { PLAID_PUBLIC_KEY } = this.state
    const {
      refreshTransactions,
      addAccount,
      isLoading,
      loggedIn,
      fetchLogOut,
    } = this.props

    return loggedIn ? (
      <div>
        <PlaidLink
          clientName="testApp"
          env={'development'}
          product={['transactions']}
          publicKey={PLAID_PUBLIC_KEY}
          onSuccess={addAccount}
        >
          Add new accounts
        </PlaidLink>
        {!isLoading ? (
          <>
            <button onClick={() => refreshTransactions()}>
              Refresh Transactions
            </button>
            <button onClick={() => fetchLogOut()}>Log Out</button>

            <LoadingContainer />
            <GraphContainer />
            <GridContainer />
          </>
        ) : (
          <LoadingContainer />
        )}
      </div>
    ) : (
      <LogInContainer />
    )
  }
}

_App.propTypes = {
  accounts: list,
  fetchTransactions: PropTypes.func,
  addAccount: PropTypes.func,
  fetchLogOut: PropTypes.func,
  graphFidelity: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
}

export default connect(
  state => ({
    accounts: accountsSelector(state),
    isLoading: isLoadingSelector(state),
    loggedIn: loggedInSelector(state),
  }),
  dispatch => ({
    refreshTransactions: () => dispatch(refreshTransactions()),
    addAccount: token => dispatch(addAccount(token)),
    fetchLogOut: () => dispatch(fetchLogOut()),
  })
)(_App)
