import React, { Component } from "react";
import { connect } from "react-redux";
import {
  selectedTransactionsSelector,
  selectedTransactionKeySelector,
  accountsSelector
} from "../reducers";
import { object, func, number, string, array } from "prop-types";
import { Grid } from "../components/Grid";

class _GridContainer extends Component {
  render() {
    const { selectedTransactions, accounts } = this.props;
    console.log(selectedTransactions);

    return (
      <div>
        <Grid selectedTransactions={selectedTransactions} accounts={accounts} />
      </div>
    );
  }
}

_GridContainer.propTypes = {
  selectedTransactionsKey: string.isRequired,
  selectedTransactions: object.isRequired,
  accounts: array.isRequired
};

export default connect(
  state => ({
    accounts: accountsSelector(state).toJS(),
    selectedTransactions: selectedTransactionsSelector(state),
    selectedTransactionsKey: selectedTransactionKeySelector(state)
  }),
  dispatch => ({})
)(_GridContainer);
