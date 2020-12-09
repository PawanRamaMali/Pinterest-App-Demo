import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  palette: {
    primary: {
      main: "#bd081c"
    },
    secondary: {
      main: "#8e8e8e"
    },
    error: {
      main: "#f44336"
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 450,
      md: 600,
      lg: 960,
      xl: 1280
    }
  },
  overrides: {}
});
