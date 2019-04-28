import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchTransactions, fetchAccessToken } from "../actions/index";
import PropTypes from "prop-types";
import PlaidLink from "react-plaid-link";
import { list } from "react-immutable-proptypes";
import {
  accountsSelector,
  dailyTransactionsSelector,
  transactionsByAccountsSelector,
  transactionsByDateInputOutputSelector,
  accessTokensSelector
} from "../reducers";
import { Graph } from "../components/Graph";
import { transactionsCombinerByDayCount } from "../utils";

class _App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PLAID_PUBLIC_KEY: "134893e5d974bced3a52c91e8e6b5a",
      PLAID_ENV: "development"
    };
  }

  render() {
    const { PLAID_PUBLIC_KEY } = this.state;
    const {
      fetchTransactions,
      dailyTransactions,
      transactionsByAccounts,
      transactionsByDateInputOutput,
      accounts,
      fetchAccessToken,
      accessTokens
    } = this.props;

    console.log(
      transactionsCombinerByDayCount({
        transactions: transactionsByDateInputOutput,
        days: 7
      })
    );
    return (
      <div>
        <PlaidLink
          clientName="testApp"
          env={"development"}
          product={["transactions"]}
          publicKey={PLAID_PUBLIC_KEY}
          onSuccess={fetchAccessToken}
        >
          Sign on modal
        </PlaidLink>
        {accessTokens.size !== 0 ? (
          <div>
            <button onClick={() => fetchTransactions({ accessTokens })}>
              GET TRANSACTIONS
            </button>
            <Graph
              dailyTransactions={dailyTransactions}
              transactionsByAccounts={transactionsByAccounts}
              transactionsByDateInputOutput={transactionsByDateInputOutput}
              accounts={accounts}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

_App.propTypes = {
  dailyTransactions: PropTypes.object,
  accounts: list,
  fetchTransactions: PropTypes.func,
  accessTokens: list,
  transactionsByDateInputOutput: PropTypes.object
};

export default connect(
  state => ({
    dailyTransactions: dailyTransactionsSelector(state),
    transactionsByDateInputOutput: transactionsByDateInputOutputSelector(state),
    transactionsByAccounts: transactionsByAccountsSelector(state),
    accounts: accountsSelector(state),
    accessTokens: accessTokensSelector(state)
  }),
  dispatch => ({
    fetchTransactions: accessToken => dispatch(fetchTransactions(accessToken)),
    fetchAccessToken: token => dispatch(fetchAccessToken(token))
  })
)(_App);
