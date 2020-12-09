import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiPinActions from "../store/actions/apiPinActions";

import AddLink from "./AddLink";

const styles = theme => ({
  root: {
    margin: 0
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
  input: {
    width: "100%"
  },
  hidden: {
    visibility: "hidden",
    height: 0,
    overflow: "hidden"
  },
  dialogThumbnailWrap: {
    display: "flex",
    justifyContent: "center",
    height: 140,
    alignItems: "center"
  },
  dialogThumbnail: {
    height: 100,
    width: "auto"
  }
});

class AddPinDialog extends Component {
  componentDidMount() {
    // if currentPin exists, set form values
    if (this.props.pin.currentPin) {
      const { imageUrl, siteUrl } = this.props.pin.currentPin;
      if (imageUrl) {
        this.props.apiPin.handleInput({
          target: { name: "imageUrl", value: imageUrl }
        });
      }
      if (siteUrl) {
        this.props.apiPin.handleInput({
          target: { name: "siteUrl", value: siteUrl }
        });
      }
    }
  }
  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.pin.form.dialogOpen}
          onClose={this.props.handleClose}
          aria-labelledby={
            this.props.modalTitle
              ? "alert-dialog-title"
              : "Save pin to your wall"
          }
          aria-describedby="Save pin to your wall"
          PaperProps={{ style: { margin: 0 } }}
        >
          {this.props.modalTitle && (
            <DialogTitle id="alert-dialog-title">
              {this.props.modalTitle}
            </DialogTitle>
          )}
          <DialogContent>
            <AddLink
              formTitle="Save Pin"
              type="dialog"
              handleInput={this.props.apiPin.handleInput}
              addPin={this.props.addPin}
              classes={this.props.classes}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.props.handleClose}
              variant="outlined"
              color="default"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

AddPinDialog.propTypes = {
  open: PropTypes.bool,
  modalTitle: PropTypes.string,
  handleClose: PropTypes.func,
  pin: PropTypes.shape({
    currentPin: PropTypes.shape({
      imageUrl: PropTypes.string,
      siteUrl: PropTypes.string
    })
  }).isRequired,
  apiPin: PropTypes.shape({
    handleInput: PropTypes.func
  }),
  addPin: PropTypes.func,
  classes: PropTypes.object
};

const mapStateToProps = state => ({
  pin: state.pin
});

const mapDispatchToProps = dispatch => ({
  apiPin: bindActionCreators(apiPinActions, dispatch)
});

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddPinDialog)
);
