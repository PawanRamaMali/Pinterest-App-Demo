import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

import { BASE_URL } from "../store/actions/apiConfig.js";
import { skip } from "../utils";
import pinIcon from "../img/pin.svg";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    [theme.breakpoints.down("xs")]: {
      marginRight: 0
    }
  },
  title: {
    color: "white",
    textDecoration: "none",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.1rem"
    }
  },
  loginButton: {
    textDecoration: "none"
  },
  avatar: {
    marginRight: 20,
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  admin: {
    display: "flex"
  },
  skip: {
    position: "absolute",
    top: "-1000px",
    left: "-1000px",
    height: "1px",
    width: "1px",
    textAlign: "left",
    overflow: "hidden",

    "&:focus": {
      position: "relative",
      top: 0,
      left: "-13px",
      width: "auto",
      height: "auto",
      overflow: "visible",
      textAlign: "center",
      zIndex: "1000"
    }
  },
  menuItem: {
    padding: "24px 16px"
  },
  logo: {
    height: 40,
    width: "auto",
    marginRight: 10
  }
});

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const { loggedIn } = this.props.appState;
    const linkMap = {
      profile: "Profile",
      all: "All Pins",
      mypins: "My Pins",
      new: "Add Pin"
    };
    const linkList = loggedIn ? Object.keys(linkMap) : ["all"];
    const ListItemLink = props => {
      const { primary, to, handleClose } = props;
      return (
        <MenuItem
          button
          component={Link}
          to={to}
          onClick={handleClose}
          className={classes.menuItem}
        >
          <ListItemText primary={primary} />
        </MenuItem>
      );
    };
    const menuLinks = linkList.map((link, index) => (
      <ListItemLink
        to={`/${link}`}
        key={index}
        primary={linkMap[link]}
        handleClose={this.handleClose}
      />
    ));
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Button
              color="secondary"
              variant="raised"
              className={classes.skip}
              onClick={() => skip("main")}
            >
              Skip to content &rsaquo;
            </Button>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              aria-owns={anchorEl ? "nav-menu" : null}
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="nav-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
              component="nav"
            >
              {menuLinks}
            </Menu>
            <img src={pinIcon} alt="" className={classes.logo} />
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              <Link to="/" className={classes.title}>
                Pinterest Clone
              </Link>
            </Typography>
            {loggedIn ? (
              <div className={classes.admin}>
                <Avatar
                  alt={this.props.profile.profile.firstName}
                  src={this.props.profile.profile.avatarUrl}
                  className={classes.avatar}
                />
                <Button
                  variant="contained"
                  size="small"
                  color="secondary"
                  className={classes.loginButton}
                  href="/logout"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                href={`${BASE_URL}/api/auth/github`}
                className={classes.loginButton}
                onClick={() => {
                  if (this.props.location.pathname !== "/logout") {
                    window.localStorage.setItem(
                      "redirect",
                      this.props.location.pathname
                    );
                  }
                }}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      firstName: PropTypes.string,
      avatarUrl: PropTypes.string
    })
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile
});

export default withRouter(withStyles(styles)(connect(mapStateToProps)(NavBar)));
