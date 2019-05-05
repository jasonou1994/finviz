import React, { Component } from "react";
import PropTypes from "prop-types";

export class GraphOptions extends Component {
  render() {
    const { setGraphFidelity, graphFidelity } = this.props;

    return (
      <div>
        <select
          value={graphFidelity}
          onChange={e => setGraphFidelity({ graphFidelity: e.target.value })}
        >
          <option value={1}>1 day</option>
          <option value={7}>7 days</option>
          <option value={30}>30 days</option>
        </select>
      </div>
    );
  }
}
GraphOptions.propTypes = {
  setGraphFidelity: PropTypes.func.isRequired,
  graphFidelity: PropTypes.number.isRequired
};
