import React, { Component } from "react";
import { connect } from "react-redux";
import { setGraphFidelity, setSelectedTransactionKey } from "../actions/index";
import { object, func, number } from "prop-types";
import { isEmpty } from "lodash";
import {
  graphFidelitySelector,
  transactionsByCategorySelector,
  transactionsByNameSelector,
  transactionsByDayCountCombinedSelector
} from "../reducers";
import { GraphOptions } from "../components/GraphOptions";
import { Graph } from "../components/Graph";

class _GraphContainer extends Component {
  render() {
    const {
      setGraphFidelity,
      graphFidelity,
      transactionsByDayCountCombined,
      transactionsByCategory,
      transactionsByName,
      setSelectedTransactionKey
    } = this.props;

    const isData = !isEmpty(transactionsByDayCountCombined) ? true : false;

    return (
      <div>
        {isData ? (
          <>
            <GraphOptions
              graphFidelity={graphFidelity}
              setGraphFidelity={setGraphFidelity}
              setSelectedTransactionKey={setSelectedTransactionKey}
            />
            <Graph
              transactionsByDayCountCombined={transactionsByDayCountCombined}
              transactionsByCategory={transactionsByCategory}
              transactionsByName={transactionsByName}
              setSelectedTransactionKey={setSelectedTransactionKey}
            />
          </>
        ) : (
          <div>Fetch transactions to view graph.</div>
        )}
      </div>
    );
  }
}

_GraphContainer.propTypes = {
  graphFidelity: number.isRequired,
  setGraphFidelity: func.isRequired,
  transactionsByDayCountCombined: object.isRequired,
  transactionsByCategory: object.isRequired,
  transactionsByName: object.isRequired,
  setSelectedTransactionKey: func.isRequired
};

export default connect(
  state => ({
    graphFidelity: graphFidelitySelector(state),
    transactionsByDayCountCombined: transactionsByDayCountCombinedSelector(
      state
    ),
    transactionsByCategory: transactionsByCategorySelector(state),
    transactionsByName: transactionsByNameSelector(state)
  }),
  dispatch => ({
    setGraphFidelity: fidelity => dispatch(setGraphFidelity(fidelity)),
    setSelectedTransactionKey: key => dispatch(setSelectedTransactionKey(key))
  })
)(_GraphContainer);
