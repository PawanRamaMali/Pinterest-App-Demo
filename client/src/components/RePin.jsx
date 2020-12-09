import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const RePin = props => (
  <div className={props.classes.container}>
    <Typography
      variant="headline"
      align="center"
      gutterBottom
      style={{ paddingTop: 20, marginBottom: 40 }}
    >
      Repin another user's image
    </Typography>
    <Button href="/all" variant="raised" color="primary">
      Browse user images
    </Button>
  </div>
);

RePin.propTypes = {
  classes: PropTypes.object
};

export default RePin;
