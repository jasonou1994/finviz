import React, { Component } from "react";
import { object } from "prop-types";
import "../../node_modules/react-vis/dist/style.css";
import {
  XYPlot,
  LineSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
  MarkSeries
} from "react-vis";
import { lineSeriesConverter } from "../utils";

export class Graph extends Component {
  render() {
    const {
      transactionsByCategory,
      transactionsByDate,
      transactionsByName
    } = this.props;

    console.log(transactionsByDate);
    const { incomeData, spendingData } = lineSeriesConverter({
      transactions: transactionsByDate
    });

    return (
      <div>
        <XYPlot height={400} width={600}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <LineSeries data={incomeData} />
          <LineSeries data={spendingData} />
        </XYPlot>
      </div>
    );
  }
}
Graph.propTypes = {
  transactionsByDate: object.isRequired,
  transactionsByCategory: object.isRequired,
  transactionsByName: object.isRequired
};
