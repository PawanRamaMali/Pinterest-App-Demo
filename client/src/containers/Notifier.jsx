import React from "react";

import CustomSnackbarContentWrapper from "../components/CustomSnackbarContent";

import Snackbar from "@material-ui/core/Snackbar";

let openSnackbarFn;

class Notifier extends React.Component {
  state = {
    open: false,
    message: "",
    variant: "info",
    action: null
  };

  componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  openSnackbar = (variant, message, action) => {
    this.setState({
      open: true,
      variant,
      message,
      action
    });
  };

  handleSnackbarClose = () => {
    this.setState({
      open: false,
      message: "",
      variant: "info",
      action: null
    });
  };

  render() {
    const message = (
      <span
        id="snackbar-message-id"
        dangerouslySetInnerHTML={{ __html: this.state.message }}
      />
    );

    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={this.state.open}
        autoHideDuration={3000}
        onClose={this.handleSnackbarClose}
      >
        <CustomSnackbarContentWrapper
          variant={this.state.variant}
          message={message}
          open={this.state.open}
          action={this.state.action}
          onClose={this.handleSnackbarClose}
        />
      </Snackbar>
    );
  }
}

export const openSnackbar = (variant, message, action) => {
  // some kind of race condition is happening between importing the
  // openSnackbar function into the target component and mounting the Notifier
  // this is dirty but it works...
  if (typeof openSnackbarFn === "function") {
    openSnackbarFn(variant, message, action);
  } else {
    setTimeout(() => openSnackbarFn(variant, message, action), 50);
  }
};

export default Notifier;
