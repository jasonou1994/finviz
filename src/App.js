import React, { Component } from "react";
import PlaidLink from "react-plaid-link";
import { getPublicToken } from "./services";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PLAID_PUBLIC_KEY: "134893e5d974bced3a52c91e8e6b5a",
      PLAID_ENV: "development",
      ACCESS_TOKEN: "access-development-24a603b2-2718-4a6e-bf97-51a1b81f3303",
      ITEM_ID: "J9Bb060X4wTKRj3mbmYJCZkNBP8kgeHbdO3AK"
    };
  }

  handleOnLinkSuccess(token) {
    const { ACCESS_TOKEN, ITEM_ID } = getPublicToken(token);

    this.setState({
      ACCESS_TOKEN,
      ITEM_ID
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
        onSuccess={this.handleOnLinkSuccess}
      >
        Sign on modal
      </PlaidLink>
    );
  }
}

export default App;
