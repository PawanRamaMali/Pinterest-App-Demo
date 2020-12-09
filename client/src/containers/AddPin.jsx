import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiPinActions from "../store/actions/apiPinActions";

import Search from "./Search";
import SearchResults from "../components/SearchResults";
import RePin from "../components/RePin";
import AddLink from "./AddLink";

import { withStyles } from "@material-ui/core/styles";

import { openSnackbar } from "./Notifier";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 400
  },
  container: {
    padding: "20px 20px 60px 20px",
    display: "flex",
    flexDirection: "column"
  },
  wrapper: {
    display: "flex",
    margin: "0 auto",
    justifyContent: "center"
  },
  form: {
    margin: "auto",
    width: "100%",
    maxWidth: 600,
    paddingBottom: 20,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    height: "100%"
  },
  button: {
    width: "100%",
    flex: "1 1 auto",
    marginTop: 20
  },
  inputClass: {
    width: "100%",
    height: 32
  },
  input: {
    width: "100%"
  },
  widget: {
    maxWidth: "33%"
  }
});

class AddPin extends Component {
  componentDidMount() {
    const pinToAdd = JSON.parse(window.localStorage.getItem("pin"));
    const flickr = window.localStorage.getItem("flickr");
    if (flickr) {
      this.props.apiPin.setFlickr(true);
      window.localStorage.removeItem("flickr");
    }
    const userId = this.props.profile.profile._id;
    if (pinToAdd) {
      if (userId !== pinToAdd.userId) {
        this.props.apiPin.handleAddPinOpen(pinToAdd);
      } else {
        openSnackbar(
          "error",
          "Pin not added, that pin is already on your wall."
        );
      }
    }
  }

  searchImage = () => {
    const keyword = encodeURIComponent(this.props.pin.form.keyword);

    if (keyword) {
      this.props.apiPin
        .searchImage(keyword)
        .then(result => {
          if (result === "SEARCH_IMAGE_FAILURE" || this.props.pin.error) {
            openSnackbar("error", "Sorry, no images found.");
          }
        })
        .catch(err => openSnackbar("error", err));
    } else {
      openSnackbar("error", "Please enter a keyword to search.");
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="addPin">
        <div className={classes.wrapper}>
          <div className={classes.widget}>
            <RePin classes={classes} />
          </div>
          <div className={classes.widget}>
            <AddLink classes={classes} addPin={this.props.addPin} />
          </div>
          <div className={classes.widget}>
            <Search searchImage={this.searchImage} classes={classes} />
          </div>
        </div>
        {this.props.pin.imageSearchResults.length ? (
          <SearchResults
            addPin={this.props.addPin}
            setRedirect={this.props.setRedirect}
          />
        ) : null}
      </div>
    );
  }
}

AddPin.propTypes = {
  pin: PropTypes.shape({
    imageSearchResults: PropTypes.array,
    error: PropTypes.string,
    form: PropTypes.shape({
      keyword: PropTypes.string
    })
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.String
    })
  }),
  apiPin: PropTypes.shape({
    clearSearchResults: PropTypes.func,
    searchImage: PropTypes.func,
    setFlickr: PropTypes.func,
    handleAddPinOpen: PropTypes.func
  }),
  classes: PropTypes.object
};

const mapStateToProps = state => ({
  pin: state.pin,
  profile: state.profile,
  appState: state.appState
});

const mapDispatchToProps = dispatch => ({
  apiPin: bindActionCreators(apiPinActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(AddPin)
  )
);
