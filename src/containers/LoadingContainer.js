import React, { Component } from "react";
import { connect } from "react-redux";
import { array, bool } from "prop-types";
import {
  accountsSelector,
  transactionsNoIntraAccountSelector,
  isLoadingSelector
} from "../reducers";
import { LoadingTransactions } from "../components/LoadingTransactions";
class _LoadingContainer extends Component {
  render() {
    const { accounts, transactionsNoIntraAccount, isLoading } = this.props;

    return (
      <div>
        <LoadingTransactions
          accounts={accounts}
          transactionsNoIntraAccount={transactionsNoIntraAccount}
          isLoading={isLoading}
        />
      </div>
    );
  }
}

_LoadingContainer.propTypes = {
  accounts: array.isRequired,
  transactionsNoIntraAccount: array.isRequired,
  isLoading: bool.isRequired
};

export default connect(
  state => ({
    accounts: accountsSelector(state).toJS(),
    transactionsNoIntraAccount: transactionsNoIntraAccountSelector(
      state
    ).toJS(),
    isLoading: isLoadingSelector(state)
  }),
  dispatch => ({})
)(_LoadingContainer);
