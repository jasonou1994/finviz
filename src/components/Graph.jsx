import React, { Component } from "react";
import { object, func } from "prop-types";
import "../../node_modules/react-vis/dist/style.css";
import { isEmpty } from "lodash";
import moment from "moment";
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  LineMarkSeries,
  Crosshair
} from "react-vis";
import { INPUT, OUTPUT } from "../constants";
import { CrosshairDisplay } from "./CrosshairDisplay";

export class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentX: 0
    };
  }

  lineSeriesConverter = () => {
    const { transactionsByDayCountCombined: transactions } = this.props;

    return Object.keys(transactions).reduce(
      (result, key, i) => {
        const unixMiliStamp = moment(key, "YYYY-MM-DD", true).valueOf();

        result.incomeSeries.push({
          x: unixMiliStamp,
          y: transactions[key][INPUT]
        });

        result.spendingSeries.push({
          x: unixMiliStamp,
          y: transactions[key][OUTPUT]
        });

        return result;
      },
      {
        incomeSeries: [],
        spendingSeries: []
      }
    );
  };

  getCurrentYs = () => {
    const { transactionsByDayCountCombined: transactions } = this.props;
    const { currentX } = this.state;

    const key = moment(currentX).format("YYYY-MM-DD");
    if (isEmpty(transactions) || !transactions[key]) {
      return {
        incomeY: 0,
        spendingY: 0
      };
    }

    return {
      incomeY: transactions[key][INPUT],
      spendingY: transactions[key][OUTPUT]
    };
  };

  render() {
    const { currentX } = this.state;
    const { setSelectedTransactionKey } = this.props;

    const { incomeSeries, spendingSeries } = this.lineSeriesConverter();
    const { incomeY, spendingY } = this.getCurrentYs();

    return (
      <div>
        <XYPlot
          height={300}
          width={600}
          xType="time"
          margin={{ left: 70, right: 10, top: 10, bottom: 70 }}
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedTransactionKey({
              key: moment(currentX).format("YYYY-MM-DD")
            });
          }}
        >
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis
            tickLabelAngle={315}
            tickFormat={time => moment(time).format("MMM Do, YYYY")}
          />
          <YAxis tickFormat={amount => `$${amount}`} />
          <LineMarkSeries
            data={incomeSeries}
            onNearestX={value => {
              const { currentX } = this.state;
              if (currentX !== value.x) {
                this.setState({ currentX: value.x });
              }
            }}
          />
          <LineMarkSeries data={spendingSeries} />
          <Crosshair values={[{ x: currentX }]}>
            <CrosshairDisplay
              time={currentX}
              income={incomeY}
              spending={spendingY}
            />
          </Crosshair>
        </XYPlot>
      </div>
    );
  }
}
Graph.propTypes = {
  transactionsByCategory: object.isRequired,
  transactionsByName: object.isRequired,
  transactionsByDayCountCombined: object.isRequired,
  setSelectedTransactionKey: func.isRequired
};
