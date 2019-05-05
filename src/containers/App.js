import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchTransactions, fetchAccessToken } from "../actions/index";
import PropTypes from "prop-types";
import PlaidLink from "react-plaid-link";
import { list } from "react-immutable-proptypes";
import { accountsSelector, accessTokensSelector } from "../reducers";
import GraphContainer from "./GraphContainer";

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
    const { fetchTransactions, fetchAccessToken, accessTokens } = this.props;

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
          <>
            <button onClick={() => fetchTransactions({ accessTokens })}>
              FETCH TRANSACTIONS
            </button>
            <GraphContainer />
          </>
        ) : (
          <div>Please add accounts.</div>
        )}
      </div>
    );
  }
}

_App.propTypes = {
  accounts: list,
  fetchTransactions: PropTypes.func,
  accessTokens: list,
  graphFidelity: PropTypes.number
};

export default connect(
  state => ({
    accounts: accountsSelector(state),
    accessTokens: accessTokensSelector(state)
  }),
  dispatch => ({
    fetchTransactions: accessToken => dispatch(fetchTransactions(accessToken)),
    fetchAccessToken: token => dispatch(fetchAccessToken(token))
  })
)(_App);
