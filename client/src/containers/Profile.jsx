import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import { openSnackbar } from "./Notifier";

import * as Actions from "../store/actions";
import * as apiProfileActions from "../store/actions/apiProfileActions";

import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";

import RainbowBokehImage from "../img/RainbowBokeh_400.png";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1200
  },
  card: {
    margin: "auto",
    width: "100%",
    maxWidth: 300
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    position: "relative"
  },
  avatar: {
    width: 80,
    height: 80,
    position: "absolute",
    top: 100,
    left: "calc(50% - 40px)"
  },
  container: {
    height: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  name: {
    color: "primary",
    textAlign: "center",
    marginTop: 15
  }
});

class Profile extends React.Component {
  componentWillMount() {
    let userId, token;
    // check route params for user id and token
    if (this.props.match && this.props.match.params.id) {
      userId = this.props.match.params.id;
      token = this.props.match.params.token;
      // if logged in for first time through social auth,
      // save userId & token to local storage
      window.localStorage.setItem("userId", JSON.stringify(userId));
      window.localStorage.setItem("authToken", JSON.stringify(token));
      this.props.actions.setLoggedIn();
      this.props.actions.setSpinner("hide");
      // remove id & token from route params after saving to local storage
      window.history.replaceState(
        null,
        null,
        `${window.location.origin}/profile`
      );
    } else {
      // if userId is not in route params
      // look in redux store or local storage
      userId =
        this.props.profile.profile._id ||
        JSON.parse(window.localStorage.getItem("userId"));
      if (window.localStorage.getItem("authToken")) {
        token = JSON.parse(window.localStorage.getItem("authToken"));
      } else {
        token = this.props.appState.authToken;
      }
    }
    // retrieve user profile & save to redux store
    this.props.api
      .getProfile(token, userId)
      .then(result => {
        if (result.type === "GET_PROFILE_SUCCESS") {
          console.log("got profile");
          this.props.actions.setLoggedIn();
          // check for redirect url in local storage
          const redirect = window.localStorage.getItem("redirect");
          if (redirect) {
            // redirect to originally requested page and then
            // clear value from local storage
            this.props.history.push(redirect);
            window.localStorage.removeItem("redirect");
          }
        } else {
          console.log("not logged in");
          openSnackbar("error", "Please log in to view your profile");
        }
      })
      .catch(err => {
        openSnackbar("error", err);
      });
  }

  render() {
    const { classes } = this.props;
    const { loggedIn } = this.props.appState;
    const redirect = window.localStorage.getItem("redirect");
    const { userName, avatarUrl } = this.props.profile.profile;
    return (
      <div className={classes.container}>
        {loggedIn &&
          !redirect && (
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image={RainbowBokehImage}
                title="Colored Lights"
              >
                <Avatar
                  alt={`${userName}`}
                  src={avatarUrl}
                  className={classes.avatar}
                />
              </CardMedia>
              <CardContent>
                <Typography variant="headline" className={classes.name}>
                  {`${userName}`}
                </Typography>
              </CardContent>
            </Card>
          )}
      </div>
    );
  }
}

Profile.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string
  }).isRequired,
  actions: PropTypes.shape({
    setLoggedIn: PropTypes.func,
    setSpinner: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    getProfile: PropTypes.func
  }).isRequired,
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string,
      userName: PropTypes.string,
      avatarUrl: PropTypes.string
    }).isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      token: PropTypes.string
    })
  })
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiProfileActions, dispatch)
});

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Profile)
  )
);
