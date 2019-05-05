import React, { Component } from "react";
import { connect } from "react-redux";
import { setGraphFidelity } from "../actions/index";
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
import { INPUT, OUTPUT } from "../constants";

class _GraphContainer extends Component {
  lineSeriesConverter = () => {
    const { transactionsByDayCountCombined: transactions } = this.props;

    const incomeData = Object.keys(transactions).map((key, i) => {
      return {
        x: i,
        y: transactions[key][INPUT]
      };
    });
    const spendingData = Object.keys(transactions).map((key, i) => {
      return {
        x: i,
        y: transactions[key][OUTPUT]
      };
    });

    return {
      incomeData,
      spendingData
    };
  };
  render() {
    const {
      setGraphFidelity,
      graphFidelity,
      transactionsByDayCountCombined,
      transactionsByCategory,
      transactionsByName
    } = this.props;
    const { incomeData, spendingData } = this.lineSeriesConverter();

    const isData = !isEmpty(transactionsByDayCountCombined) ? true : false;
    console.log(transactionsByDayCountCombined);

    return (
      <div>
        {isData ? (
          <>
            <Graph
              incomeData={incomeData}
              spendingData={spendingData}
              transactionsByCategory={transactionsByCategory}
              transactionsByName={transactionsByName}
            />
            <GraphOptions
              graphFidelity={graphFidelity}
              setGraphFidelity={setGraphFidelity}
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
  transactionsByName: object.isRequired
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
    setGraphFidelity: fidelity => dispatch(setGraphFidelity(fidelity))
  })
)(_GraphContainer);
