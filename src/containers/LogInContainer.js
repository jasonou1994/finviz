import React, { Component } from "react";
import { connect } from "react-redux";
import { userSelector } from "../reducers";
import { object, func, number, string, array, boolean } from "prop-types";
import { Grid } from "../components/Grid";
import { fetchLogIn } from "../actions";
import { LogIn } from "../components/LogIn";

class _LogInContainer extends Component {
  render() {
    const { user, fetchLogIn } = this.props;

    return <LogIn fetchLogIn={fetchLogIn} />;
  }
}

_LogInContainer.propTypes = {
  user: object.isRequired,
  fetchLogIn: func.isRequired
};

export default connect(
  state => ({
    user: userSelector(state)
  }),
  dispatch => ({
    fetchLogIn: ({ user, password }) => dispatch(fetchLogIn({ user, password }))
  })
)(_LogInContainer);
