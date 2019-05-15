import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ONE_YEAR,
  TWO_YEARS,
  SIX_MONTHS,
  THREE_MONTHS,
  CUSTOM
} from "../constants";

export class GraphOptions extends Component {
  constructor(props) {
    super(props);

    this.state = { dateSelect: ONE_YEAR };
  }
  render() {
    const {
      setGraphFidelity,
      graphFidelity,
      setSelectedTransactionKey
    } = this.props;
    const { dateSelect } = this.state;

    return (
      <div style={{ display: "flex" }}>
        <>
          <div>Group by:</div>
          <select
            value={graphFidelity}
            onChange={e => {
              setSelectedTransactionKey({ key: "" });
              setGraphFidelity({ graphFidelity: e.target.value });
            }}
          >
            <option value={1}>1 day</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
          </select>
        </>
        <>
          <div>Date range:</div>
          <select value={dateSelect} onChange={e => {}}>
            <option value={TWO_YEARS}>{TWO_YEARS}</option>
            <option value={ONE_YEAR}>{ONE_YEAR}</option>
            <option value={SIX_MONTHS}>{SIX_MONTHS}</option>
            <option value={THREE_MONTHS}>{THREE_MONTHS}</option>
            <option value={CUSTOM}>{CUSTOM}</option>
          </select>
        </>
      </div>
    );
  }
}
GraphOptions.propTypes = {
  setGraphFidelity: PropTypes.func.isRequired,
  graphFidelity: PropTypes.number.isRequired,
  setSelectedTransactionKey: PropTypes.func.isRequired
};
