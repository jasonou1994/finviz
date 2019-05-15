import React, { Component } from "react";
import PropTypes from "prop-types";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import { getAccountName } from "../reducers/transactions";

export class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "Date",
          field: "date",
          sortable: true,
          filter: true
        },
        {
          headerName: "Account",
          field: "account",
          sortable: true,
          filter: true
        },
        {
          headerName: "Merchant Name",
          field: "merchant",
          sortable: true,
          filter: true
        },
        {
          headerName: "Amount",
          field: "amount",
          sortable: true,
          filter: true
        }
      ]
    };
  }

  getRowData = () => {
    const { selectedTransactions, accounts } = this.props;
    const { transactions } = selectedTransactions;

    return transactions.map(tx => {
      const { name: merchant, account_id: account, amount, date } = tx;

      return {
        merchant,
        account: getAccountName({ accounts, id: account }),
        amount,
        date
      };
    });
  };

  render() {
    const { columnDefs } = this.state;
    const { selectedTransactions, accounts } = this.props;
    console.log(accounts);

    const { input, output } = selectedTransactions;
    const rowData = this.getRowData();

    return (
      <div>
        <div>Income: {`${input}`}</div>
        <div>Spending: {`${output}`}</div>
        <div
          className="ag-theme-balham"
          style={{
            height: "500px"
          }}
        >
          <AgGridReact columnDefs={columnDefs} rowData={rowData} />
        </div>
      </div>
    );
  }
}
Grid.propTypes = {
  selectedTransactions: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired
};
