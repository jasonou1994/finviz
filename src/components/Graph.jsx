import React, { Component } from "react";
import { object } from "prop-types";
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
      currentX: 0,
      incomeSeries: [
        { x: 1557028800000, y: 3799.7700000000004 },
        { x: 1556424000000, y: 1675.93 },
        { x: 1555732800000, y: 3566.4 },
        { x: 1555128000000, y: 2372.04 },
        { x: 1554523200000, y: 3155.5200000000004 },
        { x: 1553918400000, y: 3675.9300000000003 },
        { x: 1553227200000, y: 3602.91 },
        { x: 1552622400000, y: 3590.11 },
        { x: 1552021200000, y: 1675.93 },
        { x: 1551416400000, y: 1083.17 },
        { x: 1550811600000, y: 2287.88 },
        { x: 1550206800000, y: 2425.84 },
        { x: 1549602000000, y: 3415.29 },
        { x: 1548997200000, y: 1308.43 },
        { x: 1548392400000, y: 0 },
        { x: 1547787600000, y: 2499.87 },
        { x: 1547182800000, y: 2000 },
        { x: 1546578000000, y: 0 },
        { x: 1545886800000, y: 0 },
        { x: 1545282000000, y: 3197.91 },
        { x: 1544677200000, y: 0 },
        { x: 1543899600000, y: 0 },
        { x: 1543294800000, y: 6746.54 },
        { x: 1542603600000, y: 0 },
        { x: 1541998800000, y: 0 },
        { x: 1541304000000, y: 207.15 },
        { x: 1540440000000, y: 0 },
        { x: 1539576000000, y: 6744.83 },
        { x: 1538712000000, y: 3310.46 },
        { x: 1538020800000, y: 0 },
        { x: 1537070400000, y: 18000 },
        { x: 1536379200000, y: 1750 },
        { x: 1535774400000, y: 0 },
        { x: 1535169600000, y: 0 },
        { x: 1534564800000, y: 2367.13 },
        { x: 1533960000000, y: 0 },
        { x: 1533268800000, y: 2872.42 },
        { x: 1532664000000, y: 3126 },
        { x: 1531886400000, y: 5147.37 },
        { x: 1531281600000, y: 2745.54 },
        { x: 1530590400000, y: 0 },
        { x: 1529985600000, y: 17700 },
        { x: 1529380800000, y: 3245.35 },
        { x: 1528776000000, y: 1362.5 },
        { x: 1528171200000, y: 3826.15 },
        { x: 1527566400000, y: 871 },
        { x: 1526875200000, y: 3245.35 },
        { x: 1526270400000, y: 1572.03 },
        { x: 1525665600000, y: 0 },
        { x: 1525060800000, y: 48 }
      ],
      spendingSeries: [
        { x: 1557028800000, y: 3605.7200000000007 },
        { x: 1556424000000, y: 545.0600000000001 },
        { x: 1555732800000, y: 863.3299999999999 },
        { x: 1555128000000, y: 2283.9700000000003 },
        { x: 1554523200000, y: 753.86 },
        { x: 1553918400000, y: 2083.9 },
        { x: 1553227200000, y: 6028.290000000001 },
        { x: 1552622400000, y: 1579.5499999999997 },
        { x: 1552021200000, y: 1044.62 },
        { x: 1551416400000, y: 862.3300000000002 },
        { x: 1550811600000, y: 1053.03 },
        { x: 1550206800000, y: 1534.26 },
        { x: 1549602000000, y: 997.29 },
        { x: 1548997200000, y: 1619.8999999999999 },
        { x: 1548392400000, y: 859.6199999999999 },
        { x: 1547787600000, y: 988.23 },
        { x: 1547182800000, y: 443.82 },
        { x: 1546578000000, y: 1172.71 },
        { x: 1545886800000, y: 862.85 },
        { x: 1545282000000, y: 1297.5 },
        { x: 1544677200000, y: 1611.9600000000003 },
        { x: 1543899600000, y: 588.83 },
        { x: 1543294800000, y: 1612.4700000000003 },
        { x: 1542603600000, y: 1704.6699999999998 },
        { x: 1541998800000, y: 455.96000000000004 },
        { x: 1541304000000, y: 271.89 },
        { x: 1540440000000, y: 365.24 },
        { x: 1539576000000, y: 369.33 },
        { x: 1538712000000, y: 377.54 },
        { x: 1538020800000, y: 597.89 },
        { x: 1537070400000, y: 748.5799999999999 },
        { x: 1536379200000, y: 901.43 },
        { x: 1535774400000, y: 761.72 },
        { x: 1535169600000, y: 397.7 },
        { x: 1534564800000, y: 1320.28 },
        { x: 1533960000000, y: 502.01 },
        { x: 1533268800000, y: 1071.1799999999998 },
        { x: 1532664000000, y: 1791.24 },
        { x: 1531886400000, y: 2145.47 },
        { x: 1531281600000, y: 1447.44 },
        { x: 1530590400000, y: 3301.1699999999996 },
        { x: 1529985600000, y: 661.8199999999999 },
        { x: 1529380800000, y: 448.51 },
        { x: 1528776000000, y: 841.06 },
        { x: 1528171200000, y: 1064.98 },
        { x: 1527566400000, y: 777.8299999999999 },
        { x: 1526875200000, y: 4566.610000000001 },
        { x: 1526270400000, y: 2224.7299999999996 },
        { x: 1525665600000, y: 1633.4699999999998 },
        { x: 1525060800000, y: 964.07 }
      ]
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

    console.log(transactions);
    return {
      incomeY: transactions[key][INPUT],
      spendingY: transactions[key][OUTPUT]
    };
  };

  render() {
    // const { crosshair } = this.state;

    const { incomeSeries, spendingSeries } = this.lineSeriesConverter();

    const { currentX } = this.state;

    const { incomeY, spendingY } = this.getCurrentYs();

    return (
      <div>
        <XYPlot
          height={500}
          width={600}
          xType="time"
          margin={{ left: 70, right: 10, top: 10, bottom: 70 }}
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
  transactionsByDayCountCombined: object.isRequired
};
