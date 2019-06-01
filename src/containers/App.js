import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchTransactions, addAccount } from '../actions/index'
import PropTypes from 'prop-types'
import PlaidLink from 'react-plaid-link'
import { list } from 'react-immutable-proptypes'
import {
  accountsSelector,
  accessTokensSelector,
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
      fetchTransactions,
      addAccount,
      accessTokens,
      isLoading,
      loggedIn,
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
            <button onClick={() => fetchTransactions({ accessTokens })}>
              FETCH TRANSACTIONS
            </button>

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
  accessTokens: list,
  graphFidelity: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
}

export default connect(
  state => ({
    accounts: accountsSelector(state),
    accessTokens: accessTokensSelector(state),
    isLoading: isLoadingSelector(state),
    loggedIn: loggedInSelector(state),
  }),
  dispatch => ({
    fetchTransactions: accessToken => dispatch(fetchTransactions(accessToken)),
    addAccount: token => dispatch(addAccount(token)),
  })
)(_App)
