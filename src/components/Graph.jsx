import React, { Component } from "react";
import { list } from "react-immutable-proptypes";

import PropTypes from "prop-types";
export class Graph extends Component {
  calculateSumByAccountByDay = dailyTransactions => {};

  render() {
    const { transactionsByDateInputOutput } = this.props;
    console.log(transactionsByDateInputOutput);

    // const sumByAccountByDay = this.calculateSumByAccountByDay(
    //   dailyTransactions
    // );
    return <div />;
  }
}
Graph.propTypes = {
  dailyTransactions: PropTypes.object.isRequired,
  transactionsByAccounts: PropTypes.object.isRequired,
  transactionsByDateInputOutput: PropTypes.object.isRequired,
  accounts: list
};
