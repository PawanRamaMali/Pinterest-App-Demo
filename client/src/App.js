import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";

import * as Actions from "./store/actions";
import * as apiPinActions from "./store/actions/apiPinActions";
import * as apiProfileActions from "./store/actions/apiProfileActions";

import NavBar from "./containers/NavBar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import AddPinDialog from "./containers/AddPinDialog";
import AlertDialog from "./components/AlertDialog";
import Profile from "./containers/Profile";
import Logout from "./containers/Logout";
import UserPins from "./containers/UserPins";
import AddPin from "./containers/AddPin";
import AllPins from "./containers/AllPins";
import SinglePin from "./containers/SinglePin";

import Notifier, { openSnackbar } from "./containers/Notifier";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  notFound: {
    height: "80vh",
    width: "auto",
    marginTop: "-60px"
  },
  container: {
    maxWidth: 1200,
    padding: 60,
    margin: "auto",
    height: "100%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  message: {
    margin: "auto",
    width: "50%",
    textAlign: "center",
    height: "50%",
    lineHeight: "2em"
  },
  row: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      flexWrap: "wrap"
    }
  },
  button: {
    height: 100,
    margin: "20px auto",
    width: 100
  },
  footer: {
    width: "100vw",
    margin: "auto",
    position: "fixed",
    backgroundColor: theme.palette.primary.main,
    bottom: 0,
    padding: 5,
    display: "flex",
    justifyContent: "center",
    boxShadow: "0 1px 5px 2px rgba(0,0,0,.2)",
    zIndex: 2
  },
  footerIcon: {
    width: 20,
    height: "auto"
  }
});

class App extends Component {
  state = {
    deleteDialogOpen: false,
    selectedPin: {}
  };

  componentDidMount() {
    if (this.props.location.hash) {
      const hash = this.props.location.hash.slice(2);
      const url = `/${hash.split("=")[1]}`;
      this.props.history.push(url);
    }
    // If not logged in, check local storage for authToken
    // if it doesn't exist, it returns the string "undefined"
    if (!this.props.appState.loggedIn) {
      let token = window.localStorage.getItem("authToken");
      if (token && token !== "undefined") {
        token = JSON.parse(token);
        const userId = JSON.parse(window.localStorage.getItem("userId"));
        if (userId) {
          this.props.apiProfile.validateToken(token, userId).then(result => {
            if (result === "VALIDATE_TOKEN_FAILURE") {
              window.localStorage.clear();
            } else if (result === "VALIDATE_TOKEN_SUCESS") {
            }
          });
        }
      } else {
        console.log("no token found in local storage");
      }
    } else {
      // console.log("logged in");
    }
  }

  addPin = (e, selectedPin, dialog) => {
    e.preventDefault();
    let { imageUrl, siteUrl, title, description, flickr } = this.props.pin.form;
    const userId = this.props.profile.profile._id;
    const { userName, avatarUrl } = this.props.profile.profile;
    if (selectedPin) {
      imageUrl = flickr ? selectedPin.url : selectedPin.imageUrl;
      siteUrl = flickr ? selectedPin.context : selectedPin.siteUrl;
    }
    const token = this.props.appState.authToken;
    const body = {
      imageUrl,
      siteUrl,
      title,
      description,
      userId,
      userName,
      avatarUrl
    };

    if (!token) {
      // change this to redirect to login
      // with body and redirect saved to localStorage
      openSnackbar("error", "Please log in to add a pin.");
    }

    const imageUrlField = document.getElementById("imageUrl");
    const siteUrlField = document.getElementById("siteUrl");
    const fieldsToValidate = [imageUrlField, siteUrlField];
    fieldsToValidate.forEach(field => field.checkValidity());

    // check field validity if those fields are visible in the form
    // if they were prepopulated from another source, bypass validation

    if (!imageUrl || !title) {
      openSnackbar(
        "error",
        "Please enter an image URL and a title to add a new pin."
      );
      return;
    }
    if (imageUrlField && !dialog && !imageUrlField.validity.valid) {
      openSnackbar(
        "error",
        "Please enter an valid image URL (including http://) to add a new pin."
      );
      return;
    }
    if (
      siteUrlField &&
      !dialog &&
      siteUrlField.value !== "" &&
      !siteUrlField.validity.valid
    ) {
      openSnackbar(
        "error",
        "Please enter an valid website URL (including http://) to add a new pin."
      );
      return;
    }
    this.props.apiPin
      .addPin(token, body)
      .then(result => {
        if (result.type === "ADD_PIN_FAILURE" || this.props.pin.error) {
          openSnackbar(
            "error",
            this.props.pin.error ||
              "Sorry, something went wrong, please try again."
          );
        } else if (result.type === "ADD_PIN_SUCCESS") {
          openSnackbar("success", "Pin added.");
          this.props.apiPin.handleAddPinClose();
          this.props.apiPin.clearForm(); // also clears search results
          this.props.history.push("/mypins");
        }
      })
      .catch(err => openSnackbar("error", err));
  };

  handleClose = () => {
    this.props.apiPin.handleAddPinClose();
    this.props.apiPin.clearForm();
    this.props.history.push("/");
    window.localStorage.removeItem("pin");
  };

  setRedirect = pin => {
    window.localStorage.setItem("redirect", "/mypins");
    window.localStorage.setItem("pin", JSON.stringify(pin));
  };

  removePin = pinData => {
    this.setState({
      dialogOpen: true,
      selectedPin: { ...pinData }
    });
    const token = this.props.appState.authToken;
    this.props.apiPin
      .removePin(token, pinData._id)
      .then(result => {
        if (result.type === "REMOVE_PIN_SUCCESS") {
          openSnackbar("success", `Deleted pin from your wall.`);
          this.props.history.push("/mypins");
        } else {
          openSnackbar("error", this.props.pin.error);
        }
      })
      .catch(err => {
        console.log(err);
        openSnackbar("error", err);
      });
  };

  handleDeleteDialogOpen = pin => {
    if (pin) {
      if (!this.props.appState.loggedIn) {
        openSnackbar("error", "Please log in to delete a pin");
        return;
      } else {
        this.props.apiPin.handleDeleteOpen(pin);
      }
    }
  };

  render() {
    const { form, deleteDialogOpen, currentPin } = this.props.pin;
    const { dialogOpen } = form;
    return (
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <Notifier />
        <main className="main" id="main">
          {dialogOpen && (
            <AddPinDialog handleClose={this.handleClose} addPin={this.addPin} />
          )}
          {deleteDialogOpen && (
            <AlertDialog
              open={deleteDialogOpen}
              handleClose={this.handleDeleteDialogClose}
              content={`Delete Pin?`}
              action={() => {
                this.removePin(currentPin);
                this.props.apiPin.handleDeleteClose();
              }}
              buttonText="Delete"
            />
          )}
          <Switch>
            <Route
              exact
              path="/"
              render={routeProps => <AllPins {...routeProps} />}
            />
            <Route
              path="/profile/:id?/:token?"
              render={routeProps => <Profile {...routeProps} />}
            />
            <Route
              path="/mypins"
              render={routeProps => (
                <UserPins
                  removePin={this.removePin}
                  handleDeleteDialogOpen={this.handleDeleteDialogOpen}
                  {...routeProps}
                />
              )}
            />
            <Route
              path="/userpins/:userId"
              render={routeProps => (
                <UserPins
                  removePin={this.removePin}
                  handleDeleteDialogOpen={this.handleDeleteDialogOpen}
                  {...routeProps}
                />
              )}
            />
            <Route
              path="/pin/:pinId"
              render={routeProps => (
                <SinglePin
                  removePin={this.removePin}
                  handleDeleteDialogOpen={this.handleDeleteDialogOpen}
                  handleDeleteDialogClose={
                    this.props.apiPin.handleDeleteDialogClose
                  }
                  {...routeProps}
                />
              )}
            />
            <Route
              path="/new"
              render={routeProps => (
                <AddPin
                  addPin={this.addPin}
                  setRedirect={this.setRedirect}
                  {...routeProps}
                />
              )}
            />
            <Route
              path="/all"
              render={routeProps => <AllPins {...routeProps} />}
            />
            <Route
              path="/logout"
              render={routeProps => (
                <Logout classes={this.props.classes} {...routeProps} />
              )}
            />
            <Route
              path="*"
              render={routeProps => (
                <NotFound classes={this.props.classes} {...routeProps} />
              )}
            />
          </Switch>
        </main>
        <Footer classes={this.props.classes} />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.shape({
    hash: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string
  }).isRequired,
  apiProfile: PropTypes.shape({
    validateToken: PropTypes.func
  }).isRequired,
  apiPin: PropTypes.shape({
    addPin: PropTypes.func,
    handleAddPinClose: PropTypes.func,
    removePin: PropTypes.func,
    clearForm: PropTypes.func
  }).isRequired,
  pin: PropTypes.shape({
    form: PropTypes.shape({
      imageUrl: PropTypes.string,
      siteUrl: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      flickr: PropTypes.bool,
      dialogOpen: PropTypes.bool
    }),
    error: PropTypes.string,
    deleteDialogOpen: PropTypes.bool,
    currentPin: PropTypes.shape({
      imageUrl: PropTypes.string,
      siteUrl: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string
    })
  }).isRequired,
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string,
      userName: PropTypes.string,
      avatarUrl: PropTypes.string
    })
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  pin: state.pin
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  apiPin: bindActionCreators(apiPinActions, dispatch),
  apiProfile: bindActionCreators(apiProfileActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(App)
  )
);
