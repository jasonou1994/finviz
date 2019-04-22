import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchTransactions } from "../actions/index";
import PropTypes from "prop-types";
import PlaidLink from "react-plaid-link";
import { getPublicToken } from "../services";
import { list } from "react-immutable-proptypes";
import {
  accountsSelector,
  dailyTransactionsSelector,
  transactionsByAccountsSelector,
  transactionsByDateInputOutputSelector
} from "../reducers";
import { Graph } from "../components/Graph";

class _App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PLAID_PUBLIC_KEY: "134893e5d974bced3a52c91e8e6b5a",
      PLAID_ENV: "development",
      ACCESS_TOKEN: "access-development-24a603b2-2718-4a6e-bf97-51a1b81f3303",
      ITEM_ID: "J9Bb060X4wTKRj3mbmYJCZkNBP8kgeHbdO3AK"
    };
  }

  handleOnLinkSuccess(token) {
    const { ACCESS_TOKEN, ITEM_ID } = getPublicToken(token);

    this.setState({
      ACCESS_TOKEN,
      ITEM_ID
    });
  }

  render() {
    const { PLAID_PUBLIC_KEY, ACCESS_TOKEN } = this.state;
    const {
      fetchTransactions,
      dailyTransactions,
      transactionsByAccounts,
      transactionsByDateInputOutput,
      accounts
    } = this.props;

    return ACCESS_TOKEN ? (
      <div>
        <button onClick={() => fetchTransactions(ACCESS_TOKEN)}>
          GET TRANSACTIONS
        </button>
        <Graph
          dailyTransactions={dailyTransactions}
          transactionsByAccounts={transactionsByAccounts}
          transactionsByDateInputOutput={transactionsByDateInputOutput}
          accounts={accounts}
        />
      </div>
    ) : (
      <PlaidLink
        clientName="testApp"
        env={"development"}
        product={["transactions"]}
        publicKey={PLAID_PUBLIC_KEY}
        onSuccess={this.handleOnLinkSuccess}
      >
        Sign on modal
      </PlaidLink>
    );
  }
}

_App.propTypes = {
  dailyTransactions: PropTypes.object,
  accounts: list,
  fetchTransactions: PropTypes.func
};

export default connect(
  state => ({
    dailyTransactions: dailyTransactionsSelector(state),
    transactionsByDateInputOutput: transactionsByDateInputOutputSelector(state),
    transactionsByAccounts: transactionsByAccountsSelector(state),
    accounts: accountsSelector(state)
  }),
  dispatch => ({
    fetchTransactions: accessToken => dispatch(fetchTransactions(accessToken))
  })
)(_App);
