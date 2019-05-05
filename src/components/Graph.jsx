import React, { Component } from "react";
import { object, array } from "prop-types";
import "../../node_modules/react-vis/dist/style.css";
import {
  XYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  LineMarkSeries,
  Crosshair
} from "react-vis";
import { lineSeriesConverter } from "../utils";

export class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crosshair: { x: 0, y: 0 },
      incomeData: [
        { x: 0, y: 3799.7700000000004 },
        { x: 1, y: 1675.93 },
        { x: 2, y: 3566.4 },
        { x: 3, y: 2372.04 },
        { x: 4, y: 3155.5200000000004 },
        { x: 5, y: 3675.9300000000003 },
        { x: 6, y: 3602.91 },
        { x: 7, y: 3590.11 },
        { x: 8, y: 1675.93 },
        { x: 9, y: 1083.17 },
        { x: 10, y: 2287.88 },
        { x: 11, y: 2425.84 },
        { x: 12, y: 3415.29 },
        { x: 13, y: 1308.43 },
        { x: 14, y: 0 },
        { x: 15, y: 2499.87 },
        { x: 16, y: 2000 },
        { x: 17, y: 0 },
        { x: 18, y: 0 },
        { x: 19, y: 3197.91 },
        { x: 20, y: 0 },
        { x: 21, y: 0 },
        { x: 22, y: 6746.54 },
        { x: 23, y: 0 },
        { x: 24, y: 0 },
        { x: 25, y: 207.15 },
        { x: 26, y: 0 },
        { x: 27, y: 6744.83 },
        { x: 28, y: 3310.46 },
        { x: 29, y: 0 },
        { x: 30, y: 18000 },
        { x: 31, y: 1750 },
        { x: 32, y: 0 },
        { x: 33, y: 0 },
        { x: 34, y: 2367.13 },
        { x: 35, y: 0 },
        { x: 36, y: 2872.42 },
        { x: 37, y: 3126 },
        { x: 38, y: 5147.37 },
        { x: 39, y: 2745.54 },
        { x: 40, y: 0 },
        { x: 41, y: 17700 },
        { x: 42, y: 3245.35 },
        { x: 43, y: 1362.5 },
        { x: 44, y: 3826.15 },
        { x: 45, y: 871 },
        { x: 46, y: 3245.35 },
        { x: 47, y: 1572.03 },
        { x: 48, y: 0 },
        { x: 49, y: 48 }
      ],
      spendingData: [
        { x: 0, y: 3542.890000000001 },
        { x: 1, y: 545.0600000000001 },
        { x: 2, y: 863.3299999999999 },
        { x: 3, y: 2283.9700000000003 },
        { x: 4, y: 753.86 },
        { x: 5, y: 2083.9 },
        { x: 6, y: 6028.290000000001 },
        { x: 7, y: 1579.5499999999997 },
        { x: 8, y: 1044.62 },
        { x: 9, y: 862.3300000000002 },
        { x: 10, y: 1053.03 },
        { x: 11, y: 1534.26 },
        { x: 12, y: 997.29 },
        { x: 13, y: 1619.8999999999999 },
        { x: 14, y: 859.6199999999999 },
        { x: 15, y: 988.23 },
        { x: 16, y: 443.82 },
        { x: 17, y: 1172.71 },
        { x: 18, y: 862.85 },
        { x: 19, y: 1297.5 },
        { x: 20, y: 1611.9600000000003 },
        { x: 21, y: 588.83 },
        { x: 22, y: 1612.4700000000003 },
        { x: 23, y: 1704.6699999999998 },
        { x: 24, y: 455.96000000000004 },
        { x: 25, y: 271.89 },
        { x: 26, y: 365.24 },
        { x: 27, y: 369.33 },
        { x: 28, y: 377.54 },
        { x: 29, y: 597.89 },
        { x: 30, y: 748.5799999999999 },
        { x: 31, y: 901.43 },
        { x: 32, y: 761.72 },
        { x: 33, y: 397.7 },
        { x: 34, y: 1320.28 },
        { x: 35, y: 502.01 },
        { x: 36, y: 1071.1799999999998 },
        { x: 37, y: 1791.24 },
        { x: 38, y: 2145.47 },
        { x: 39, y: 1447.44 },
        { x: 40, y: 3301.1699999999996 },
        { x: 41, y: 661.8199999999999 },
        { x: 42, y: 448.51 },
        { x: 43, y: 841.06 },
        { x: 44, y: 1064.98 },
        { x: 45, y: 777.8299999999999 },
        { x: 46, y: 4566.610000000001 },
        { x: 47, y: 2224.7299999999996 },
        { x: 48, y: 1633.4699999999998 },
        { x: 49, y: 964.07 }
      ]
    };
  }

  render() {
    const {
      transactionsByCategory,
      incomeData,
      spendingData,
      transactionsByName
    } = this.props;
    const { crosshair } = this.state;
    // const { incomeData, spendingData, crosshair } = this.state;

    const incomeY = incomeData.find(data => data.x === crosshair.x).y;
    const spendingY = spendingData.find(data => data.x === crosshair.x).y;

    return (
      <div>
        <XYPlot height={250} width={600} xType="time">
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <LineMarkSeries
            data={incomeData}
            onNearestX={value => {
              this.setState({ crosshair: value });
            }}
          />
          <LineMarkSeries data={spendingData} />
          <Crosshair
            values={[{ x: crosshair.x, y: incomeY }, { x: 35, y: spendingY }]}
          />
        </XYPlot>
      </div>
    );
  }
}
Graph.propTypes = {
  transactionsByCategory: object.isRequired,
  transactionsByName: object.isRequired,
  incomeData: array.isRequired,
  spendingData: array.isRequired
};
