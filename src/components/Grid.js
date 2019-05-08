import React, { Component } from "react";
import PropTypes from "prop-types";

export class Grid extends Component {
  render() {
    const { selectedTransactions } = this.props;

    const { input, output, transactions } = selectedTransactions;

    return (
      <div>
        Grid
        <div>Income: {`${input}`}</div>
        <div>Spending: {`${output}`}</div>
        {transactions.map(tx => {
          const { name, amount } = tx;
          return <div>{`${name}, ${amount}`}</div>;
        })}
      </div>
    );
  }
}
Grid.propTypes = { selectedTransactions: PropTypes.object.isRequired };
