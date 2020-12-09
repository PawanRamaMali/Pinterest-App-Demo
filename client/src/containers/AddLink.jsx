import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import * as apiPinActions from "../store/actions/apiPinActions";

import ButtonWithSpinner from "../components/ButtonWithSpinner";

class AddLink extends React.Component {
  addLink = e => {
    const dialog = this.props.type === "dialog";
    let pinToAdd;
    if (dialog) {
      pinToAdd = this.props.pin.currentPin;
    } else {
      const { imageUrl, siteUrl, title, description } = this.props.pin.form;
      pinToAdd = {
        imageUrl,
        siteUrl,
        title,
        description
      };
    }
    this.props.addPin(e, pinToAdd, dialog);
  };

  render() {
    const dialog = this.props.type === "dialog";
    const { classes } = this.props;
    const { imageUrl, siteUrl, url, context } = this.props.pin.currentPin;
    const { title, description } = this.props.pin.form;
    const inputClass = dialog ? classes.hidden : classes.inputClass;
    return (
      <div style={{ padding: "20 20 0 20" }}>
        <Typography
          variant="headline"
          align="center"
          gutterBottom
          style={{ paddingTop: 20 }}
        >
          {dialog ? "Save to your wall" : "Add image by pasting in a URL"}
        </Typography>
        <div className={classes.dialogThumbnailWrap}>
          <img
            src={dialog ? imageUrl || url : this.props.imageUrl}
            className={classes.dialogThumbnail}
            alt={this.props.title}
          />
        </div>
        <form className={classes.form} onError={errors => console.log(errors)}>
          <TextField
            name="imageUrl"
            id="imageUrl"
            label="Image URL"
            type="url"
            variant="outlined"
            required
            value={dialog ? imageUrl || url : this.props.pin.form.imageUrl}
            onChange={this.props.apiPin.handleInput}
            InputProps={{
              className: inputClass
            }}
            className={dialog ? classes.hidden : classes.input}
          />
          <TextField
            name="siteUrl"
            id="siteUrl"
            label="Website URL"
            type="url"
            variant="outlined"
            required
            value={dialog ? siteUrl || context : this.props.pin.form.siteUrl}
            onChange={this.props.apiPin.handleInput}
            InputProps={{
              className: inputClass
            }}
            className={dialog ? classes.hidden : classes.input}
          />
          <TextField
            name="title"
            id="title"
            label="Title"
            type="text"
            variant="outlined"
            value={title}
            required
            onChange={this.props.apiPin.handleInput}
            className={classes.input}
          />
          <TextField
            name="description"
            label="Description"
            variant="outlined"
            type="text"
            value={description}
            onChange={this.props.apiPin.handleInput}
            className={classes.input}
          />
          <ButtonWithSpinner
            type="submit"
            color="primary"
            className={classes.button}
            variant="raised"
            onClick={this.addLink}
            loading={this.props.pin.loading}
          >
            Save pin
          </ButtonWithSpinner>
        </form>
      </div>
    );
  }
}

AddLink.propTypes = {
  type: PropTypes.string,
  pin: PropTypes.shape({
    form: PropTypes.shape({
      imageUrl: PropTypes.string,
      siteUrl: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string
    }),
    loading: PropTypes.bool,
    currentPin: PropTypes.shape({
      imageUrl: PropTypes.string,
      siteUrl: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string
    })
  }).isRequired,
  apiPin: PropTypes.shape({
    handleInput: PropTypes.func
  }),
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  addPin: PropTypes.func,
  classes: PropTypes.object
};

const mapStateToProps = state => ({
  pin: state.pin
});

const mapDispatchToProps = dispatch => ({
  apiPin: bindActionCreators(apiPinActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddLink);
