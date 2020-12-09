import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import * as apiPinActions from "../store/actions/apiPinActions";

import ButtonWithSpinner from "../components/ButtonWithSpinner";

class Search extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div style={{ padding: 20 }}>
        <Typography
          variant="headline"
          align="center"
          gutterBottom
          style={{ paddingTop: 20 }}
        >
          Search for an image on Flickr
        </Typography>
        <form className={classes.form} onError={errors => console.log(errors)}>
          <TextField
            name="keyword"
            label="Keywords"
            value={this.props.pin.form.keyword}
            onChange={this.props.apiPin.handleInput}
            onKeyDown={e => {
              if (e.which === 13 || e.keyCode === 13) {
                e.preventDefault();
                console.log("enter");
                this.props.searchImage();
              }
            }}
            className={classes.input}
          />
          <ButtonWithSpinner
            type="button"
            color="primary"
            className={classes.button}
            variant="raised"
            onClick={this.props.searchImage}
            loading={this.props.pin.loading}
          >
            Search images
          </ButtonWithSpinner>
        </form>
      </div>
    );
  }
}

Search.propTypes = {
  pin: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.string,
    form: PropTypes.shape({
      keyword: PropTypes.string
    })
  }),
  apiPin: PropTypes.shape({
    handleInput: PropTypes.func
  }),
  searchImage: PropTypes.func,
  classes: PropTypes.object
};

const mapStateToProps = state => ({
  pin: state.pin
});

const mapDispatchToProps = dispatch => ({
  apiPin: bindActionCreators(apiPinActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Search)
);
