import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import placeholder from "../img/placeholder.png";

const styles = theme => ({
  image: {
    width: 280,
    height: "auto",
    borderRadius: 6,
    margin: 10
  },
  singleImage: {
    borderRadius: 6,
    width: 480,
    maxWidth: "calc(100% - 20px)",
    height: "auto",
    margin: 10
  }
});

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
  }

  componentDidMount() {
    // console.log(this.props.imageUrl);
  }

  handleError = () => {
    this.setState({
      error: true
    });
  };

  render() {
    const { classes } = this.props;
    const single = this.props.type === "single";
    return (
      <img
        className={single ? classes.singleImage : classes.image}
        src={this.state.error ? placeholder : this.props.imageUrl}
        alt={this.props.title}
        onLoad={e => {
          if (e.target.src !== placeholder) {
            // console.log(e.target.src);
            this.setState({ error: false });
            this.props.handleParentError(true);
          }
        }}
        onError={e => {
          console.log(e.target.src);
          this.handleError();
          this.props.handleParentError();
        }}
      />
    );
  }
}

Image.propTypes = {
  type: PropTypes.string,
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  handleParentError: PropTypes.func
};

export default withStyles(styles)(Image);
