import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as Actions from "../store/actions";

import Typography from "@material-ui/core/Typography";

class Logout extends React.Component {
  componentDidMount() {
    this.props.actions.logout();
    window.localStorage.clear();
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        <Typography variant="headline" className={this.props.classes.message}>
          Goodbye!
        </Typography>
      </div>
    );
  }
}

Logout.propTypes = {
  actions: PropTypes.shape({
    logout: PropTypes.func
  }).isRequired,
  classes: PropTypes.object
};

const mapStateToProps = state => ({
  appState: state.appState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout);
