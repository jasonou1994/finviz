import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchTransactions, fetchAccessToken } from "../actions/index";
import PropTypes from "prop-types";
import PlaidLink from "react-plaid-link";
import { list } from "react-immutable-proptypes";
import {
  accountsSelector,
  accessTokensSelector,
  transactionsByDateInputOutputSelector,
  transactionsByCategorySelector,
  transactionsByNameSelector
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
      transactionsByDateInputOutput,
      transactionsByCategory,
      transactionsByName,
      fetchAccessToken,
      accessTokens
    } = this.props;

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
              FETCH TRANSACTIONS
            </button>
            <Graph
              transactionsByDate={transactionsCombinerByDayCount({
                transactions: transactionsByDateInputOutput,
                days: 7
              })}
              transactionsByCategory={transactionsByCategory}
              transactionsByName={transactionsByName}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

_App.propTypes = {
  accounts: list,
  fetchTransactions: PropTypes.func,
  accessTokens: list,
  transactionsByDateInputOutput: PropTypes.object,
  transactionsByCategory: PropTypes.object,
  transactionsByName: PropTypes.object
};

export default connect(
  state => ({
    transactionsByDateInputOutput: transactionsByDateInputOutputSelector(state),
    transactionsByCategory: transactionsByCategorySelector(state),
    transactionsByName: transactionsByNameSelector(state),
    accounts: accountsSelector(state),
    accessTokens: accessTokensSelector(state)
  }),
  dispatch => ({
    fetchTransactions: accessToken => dispatch(fetchTransactions(accessToken)),
    fetchAccessToken: token => dispatch(fetchAccessToken(token))
  })
)(_App);
