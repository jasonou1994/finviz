import React, { Component } from "react";
import { number } from "prop-types";
import { formatMilliseconds, formatNumberAsDollars } from "../utils";

export class CrosshairDisplay extends Component {
  render() {
    const { time, income, spending } = this.props;

    return (
      <div
        style={{
          borderRadius: "3px",
          backgroundColor: "black",
          padding: "3px",
          width: "100px"
        }}
      >
        <h4>{formatMilliseconds(time)}</h4>
        <div>Income: {formatNumberAsDollars(Number(income))}</div>
        <div>Spending: {formatNumberAsDollars(Number(spending))}</div>
      </div>
    );
  }
}
CrosshairDisplay.propTypes = {
  time: number.isRequired,
  income: number.isRequired,
  spending: number.isRequired
};
