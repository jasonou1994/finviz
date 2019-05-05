import React, { Component } from "react";
import { connect } from "react-redux";
import { setGraphFidelity } from "../actions/index";
import PropTypes from "prop-types";
import { graphFidelitySelector } from "../reducers";
import { GraphOptions } from "../components/GraphOptions";

class _GraphOptionsContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { setGraphFidelity, graphFidelity } = this.props;
    return (
      <div>
        <GraphOptions
          graphFidelity={graphFidelity}
          setGraphFidelity={setGraphFidelity}
        />
      </div>
    );
  }
}

_GraphOptionsContainer.propTypes = {
  graphFidelity: PropTypes.number.isRequired,
  setGraphFidelity: PropTypes.func.isRequired
};

export default connect(
  state => ({
    graphFidelity: graphFidelitySelector(state)
  }),
  dispatch => ({
    setGraphFidelity: fidelity => dispatch(setGraphFidelity(fidelity))
  })
)(_GraphOptionsContainer);
