import React, { Component } from 'react'
import { connect } from 'react-redux'
import { userSelector } from '../reducers'
import { object, func } from 'prop-types'
import { fetchLogIn, fetchCreateUser } from '../actions'
import { LogIn } from '../components/LogIn'
import { LogOut } from '../components/LogOut'

class _LogInContainer extends Component {
  render() {
    const { fetchLogIn, fetchCreateUser } = this.props

    return (
      <div>
        <LogIn fetchLogIn={fetchLogIn} />
        <LogOut fetchCreateUser={fetchCreateUser} />
      </div>
    )
  }
}

_LogInContainer.propTypes = {
  user: object.isRequired,
  fetchLogIn: func.isRequired,
}

export default connect(
  state => ({
    user: userSelector(state),
  }),
  dispatch => ({
    fetchLogIn: ({ user, password }) =>
      dispatch(fetchLogIn({ user, password })),
    fetchCreateUser: ({ user, password }) =>
      dispatch(fetchCreateUser({ user, password })),
  })
)(_LogInContainer)
