import update from "immutability-helper";

import {
  LOGOUT,
  SET_LOGGEDIN,
  SET_REDIRECT_URL,
  SET_SPINNER
} from "../actions";
import {
  VALIDATE_TOKEN_SUCCESS,
  VALIDATE_TOKEN_FAILURE,
  GET_PROFILE_SUCCESS
} from "../actions/apiProfileActions";

const INITIAL_STATE = {
  loggedIn: false,
  authToken: "",
  spinnerClass: "spinner__hide",
  loading: false,
  redirect: ""
};

function appState(state = INITIAL_STATE, action) {
  // let error;
  switch (action.type) {
    case LOGOUT:
      return INITIAL_STATE;

    case SET_SPINNER:
      return update(state, {
        spinnerClass: { $set: `spinner__${action.payload}` }
      });

    case VALIDATE_TOKEN_SUCCESS:
      return update(state, {
        loggedIn: { $set: true },
        authToken: { $set: action.meta.token } // meta or payload??
      });

    case GET_PROFILE_SUCCESS:
      return update(state, {
        authToken: { $set: action.payload.token } // meta or payload??
      });

    case VALIDATE_TOKEN_FAILURE:
      return update(state, { loggedIn: { $set: false } });

    case SET_REDIRECT_URL:
      return update(state, { redirect: { $set: action.payload } });

    case SET_LOGGEDIN:
      return update(state, { loggedIn: { $set: true } });

    default:
      return state;
  }
}

export default appState;
