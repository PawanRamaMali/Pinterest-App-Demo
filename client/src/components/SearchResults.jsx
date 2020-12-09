import React from "react";
import PropTypes from "prop-types";

import ImageGrid from "../containers/ImageGrid";

import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1920
  },
  container: {
    padding: "0px 20px 60px 20px"
  }
});

const SearchResults = props => (
  <div className={props.classes.container}>
    <Divider style={{ margin: 20 }} />
    <ImageGrid
      listType="search"
      title="Search Results"
      setRedirect={props.setRedirect}
      addPin={props.addPin}
    />
  </div>
);

SearchResults.propTypes = {
  classes: PropTypes.object,
  setRedirect: PropTypes.func,
  addPin: PropTypes.func
};

export default withStyles(styles)(SearchResults);
