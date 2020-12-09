import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import psl from "psl";

import * as apiPinActions from "../store/actions/apiPinActions";

import { withStyles } from "@material-ui/core/styles";
import Delete from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import pinIcon from "../img/pin.svg";
import arrow from "../img/arrow.png";
import { openSnackbar } from "./Notifier";
import SpinnerAdornment from "../components/SpinnerAdornment";
import Image from "../components/Image";
import { BASE_URL } from "../store/actions/apiConfig.js";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1200
  },
  button: {
    margin: theme.spacing.unit,
    flex: "0 0 auto",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: 7,
      top: 20,
      flex: "1 1 auto"
    }
  },
  metaWrap: {
    padding: 40,
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      padding: "20px 10px",
      width: "100%"
    }
  },
  pinButton: {
    width: 100
  },
  siteLink: {
    marginTop: 15
  },
  pinIcon: {
    height: 27,
    marginLeft: -9,
    width: "auto"
  },
  arrow: {
    height: 20,
    width: "auto"
  },
  owner: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginTop: 10,
      padding: "0 10px"
    }
  },
  userName: {
    marginLeft: 10,
    textDecoration: "none",
    "&:hover": {
      borderBottom: "1px dotted #ccc"
    }
  },
  imageWrap: {
    position: "relative",
    width: 500,
    maxWidth: "100%",
    display: "flex",
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      padding: 0
    }
  },
  deleteButton: {
    position: "absolute",
    top: 20,
    right: 20,
    visibility: "hidden",
    zIndex: 2,
    // [theme.breakpoints.down("sm")]: {
    //   visibility: "visible",
    //   top: "auto",
    //   bottom: 30
    // },
    ["@media all and (hover: none)"]: {
      visibility: "visible",
      top: "auto",
      bottom: 30,
      right: 20
    }
  },
  contentBold: {
    fontWeight: 700
  },
  contentLight: {
    fontWeight: 100
  },
  contentRegular: {
    fontWeight: 400
  },
  container: {
    width: "100%",
    height: "100%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 40,
    alignItems: "flex-start",
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap"
    }
  },
  item: {
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap"
    }
  },
  divider: {
    margin: "20px 0px"
  },
  actionArea: {
    borderRadius: 6,
    zIndex: 1,
    width: 500,
    maxWidth: "100%",
    cursor: "zoom-in",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,.05)"
    },
    "&:hover $pinButton": {
      visibility: "visible"
    },
    "&:hover $deleteButton": {
      visibility: "visible"
    }
  },
  ownerInfo: {
    display: "flex",
    alignItems: "center",
    fontWeight: 100,
    textDecoration: "none"
  },
  pinInfo: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: "0 10px"
    }
  },
  avatar: {},
  title: {
    fontSize: 36,
    fontWeight: 100,
    marginTop: 20,
    textTransform: "capitalize"
  },
  description: {
    fontSize: "1.1em",
    fontWeight: 100,
    marginTop: 10
  },
  error: {
    fontWeight: 400,
    color: theme.palette.error.main,
    textAlign: "center"
  },
  spinner: {
    position: "absolute",
    left: "calc(50% - 10px)",
    top: "calc(50% - 10px)"
  }
});

class SinglePin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
  }

  componentDidMount() {
    if (this.props.match.params && this.props.match.params.pinId) {
      const { pinId } = this.props.match.params;
      this.props.apiPin.getPinById(pinId).then(result => {
        if (result.type === "GET_PIN_BY_ID_FAILURE" || this.props.pin.error) {
          openSnackbar(
            "error",
            this.props.pin.error || "Sorry, something went wrong."
          ).catch(err => {
            console.log(err);
            openSnackbar("error", err);
          });
        } else {
          // console.log(this.props.pin.currentPin);
        }
      });
    } else {
      openSnackbar("error", "Sorry, something went wrong.");
    }
  }

  handleError = unset => {
    console.log(`image load error: ${unset}`);
    const error = unset ? false : true;
    this.setState({
      error
    });
  };

  openAddPinDialog = tile => {
    if (this.props.appState.loggedIn) {
      this.props.apiPin.handleAddPinOpen(tile);
    } else {
      window.localStorage.setItem("redirect", "/new");
      window.localStorage.setItem("pin", JSON.stringify(tile));
      window.location.href = `${BASE_URL}/api/auth/github`;
    }
  };

  render() {
    const { classes } = this.props;
    const { currentPin } = this.props.pin;
    const {
      imageUrl,
      siteUrl,
      userId,
      userName,
      userAvatarUrl,
      title,
      description
    } = currentPin;
    console.log(imageUrl);
    const owner = this.props.profile.profile._id === userId;
    let parsed;
    if (siteUrl) {
      const url = siteUrl.split("/")[2];
      const input = psl.parse(url);
      parsed = input.domain;
    }
    return (
      <div className={classes.container}>
        <div className={classes.imageWrap}>
          <div
            className={classes.actionArea}
            tabIndex={0}
            onClick={() => {
              if (owner) {
                this.props.handleDeleteDialogOpen(currentPin);
              } else {
                let win = window.open(siteUrl, "_blank");
                win.focus();
              }
            }}
          >
            {owner && (
              <Button
                className={classes.deleteButton}
                onClick={() => this.props.handleDeleteDialogOpen(currentPin)}
                color="primary"
                variant="fab"
                aria-label="Delete Pin"
              >
                <Delete />
              </Button>
            )}
            {imageUrl ? (
              <Image
                imageUrl={imageUrl}
                title={title}
                type="single"
                handleParentError={this.handleError}
              />
            ) : (
              <SpinnerAdornment className={classes.spinner} />
            )}
            {this.state.error && (
              <Typography className={classes.error}>
                Sorry, looks like this image link is broken :(
              </Typography>
            )}
          </div>
        </div>
        <div className={classes.metaWrap}>
          {!owner && (
            <Button
              className={classes.pinButton}
              onClick={() => this.openAddPinDialog(currentPin)}
              color="primary"
              variant="raised"
              aria-label="Save Pin"
            >
              <img src={pinIcon} alt="" className={classes.pinIcon} />
              Save
            </Button>
          )}
          <Button
            className={classes.siteLink}
            href={siteUrl}
            target="blank"
            color="default"
            variant="raised"
          >
            <img alt="" src={arrow} className={classes.arrow} />
            <Typography component="p" className={classes.contentBold}>
              {parsed}
            </Typography>
          </Button>
          <Divider className={classes.divider} />
          <Link className={classes.ownerInfo} to={`/userpins/${userId}`}>
            <Avatar
              className={classes.avatar}
              src={userAvatarUrl}
              alt={userName}
            />
            <Typography component="p" className={classes.userName}>
              <span className={classes.contentLight}>Saved by</span>{" "}
              <span className={classes.contentBold}>{userName}</span>
            </Typography>
          </Link>
          <Typography component="h2" className={classes.title}>
            {title}
          </Typography>
          <Typography component="p" className={classes.description}>
            {description}
          </Typography>
        </div>
      </div>
    );
  }
}

SinglePin.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool
  }),
  pin: PropTypes.shape({
    error: PropTypes.string,
    currentPin: PropTypes.shape({
      imageUrl: PropTypes.string,
      siteUrl: PropTypes.string,
      userId: PropTypes.string,
      userName: PropTypes.string,
      userAvatarUrl: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string
    })
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string
    })
  }),
  classes: PropTypes.object,
  apiPin: PropTypes.shape({
    getPinById: PropTypes.func,
    handleAddPinOpen: PropTypes.func
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      pinId: PropTypes.string
    })
  }),
  handleDeleteDialogOpen: PropTypes.func
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  pin: state.pin
});

const mapDispatchToProps = dispatch => ({
  apiPin: bindActionCreators(apiPinActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SinglePin)
  )
);
