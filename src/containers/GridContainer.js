import React, { Component } from "react";
import { connect } from "react-redux";
import {
  selectedTransactionsSelector,
  selectedTransactionKeySelector
} from "../reducers";
import { object, func, number, string } from "prop-types";
import { Grid } from "../components/Grid";

class _GridContainer extends Component {
  render() {
    const { selectedTransactions } = this.props;
    console.log(selectedTransactions);

    return (
      <div>
        <Grid selectedTransactions={selectedTransactions} />
      </div>
    );
  }
}

_GridContainer.propTypes = {
  selectedTransactionsKey: string.isRequired,
  selectedTransactions: object.isRequired
};

export default connect(
  state => ({
    selectedTransactions: selectedTransactionsSelector(state),
    selectedTransactionsKey: selectedTransactionKeySelector(state)
  }),
  dispatch => ({})
)(_GridContainer);
