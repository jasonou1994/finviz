import React, { Component } from 'react'
import { func } from 'prop-types'

export class LogOut extends Component {
  constructor(props) {
    super(props)
    this.state = { userInput: '', passwordInput: '' }
  }

  submitCreateAccount = () => {
    const { userInput, passwordInput } = this.state
    const { fetchCreateUser } = this.props

    fetchCreateUser({
      user: userInput,
      password: passwordInput,
    })
  }

  render() {
    const { userInput, passwordInput } = this.state

    return (
      <div>
        <div>Create new account</div>
        <input
          type="text"
          value={userInput}
          placeholder="Username"
          onChange={e => {
            this.setState({ userInput: e.target.value })
          }}
        />
        <input
          type="text"
          value={passwordInput}
          placeholder="Password"
          onChange={e => {
            this.setState({ passwordInput: e.target.value })
          }}
        />
        <button onClick={this.submitCreateAccount}>Create</button>
      </div>
    )
  }
}
LogOut.propTypes = {
  fetchCreateUser: func.isRequired,
}
