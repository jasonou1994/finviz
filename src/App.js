import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Client, environments } from "plaid";
import PlaidLink from "react-plaid-link";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PLAID_CLIENT_ID: "5c52345ce341ed0010a522f1",
      PLAID_SECRET: "259a3db7aec2d3314a6e545d056a10",
      PLAID_PUBLIC_KEY: "134893e5d974bced3a52c91e8e6b5a",
      PLAID_ENV: "development",
      ACCESS_TOKEN: "access-development-24a603b2-2718-4a6e-bf97-51a1b81f3303",
      ITEM_ID: "J9Bb060X4wTKRj3mbmYJCZkNBP8kgeHbdO3AK"
    };
  }

  handleOnSuccess(token, metadata) {
    console.log("public token:", token);
    fetch("http://localhost:8000/get_access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        public_token: token
      })
    })
      .then(res => res.json())
      .then(res => {
        const { ACCESS_TOKEN, ITEM_ID } = res;
        this.setState({
          ACCESS_TOKEN,
          ITEM_ID
        });
      });
  }

  render() {
    const { PLAID_PUBLIC_KEY, ACCESS_TOKEN } = this.state;
    return ACCESS_TOKEN ? (
      <button>GET TRANSACTIONS</button>
    ) : (
      <PlaidLink
        clientName="testApp"
        env={"development"}
        product={["transactions"]}
        publicKey={PLAID_PUBLIC_KEY}
        onSuccess={this.handleOnSuccess}
      >
        Sign on modal
      </PlaidLink>
    );
  }
}

export default App;
