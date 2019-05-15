import React, { Component } from "react";
import { number, func } from "prop-types";
import { formatMilliseconds, formatNumberAsDollars } from "../utils";

export class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = { userInput: "", passwordInput: "" };
  }

  submitLogIn = () => {
    const { userInput, passwordInput } = this.state;
    const { fetchLogIn } = this.props;

    fetchLogIn({
      user: userInput,
      password: passwordInput
    });
  };

  render() {
    const { userInput, passwordInput } = this.state;

    return (
      <div>
        <input
          type="text"
          value={userInput}
          placeholder="Username"
          onChange={e => {
            this.setState({ userInput: e.target.value });
          }}
        />
        <input
          type="text"
          value={passwordInput}
          placeholder="Password"
          onChange={e => {
            this.setState({ passwordInput: e.target.value });
          }}
        />
        <button onClick={this.submitLogIn}>Log In</button>
      </div>
    );
  }
}
LogIn.propTypes = {
  fetchLogIn: func.isRequired
};
