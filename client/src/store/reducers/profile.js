import update from "immutability-helper";

import { LOGOUT } from "../actions";
import {
  VALIDATE_TOKEN_REQUEST,
  VALIDATE_TOKEN_SUCCESS,
  VALIDATE_TOKEN_FAILURE,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  GET_PARTIAL_PROFILE_REQUEST,
  GET_PARTIAL_PROFILE_SUCCESS,
  GET_PARTIAL_PROFILE_FAILURE,
  MODIFY_PROFILE_REQUEST,
  MODIFY_PROFILE_SUCCESS,
  MODIFY_PROFILE_FAILURE
} from "../actions/apiProfileActions";

const INITIAL_STATE = {
  loading: false,
  profile: {
    _id: "",
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    avatarUrl: ""
  },
  partialProfile: {
    userName: "",
    avatarUrl: ""
  },
  error: null
};

function profile(state = INITIAL_STATE, action) {
  let error;

  switch (action.type) {
    case LOGOUT:
      return INITIAL_STATE;

    case VALIDATE_TOKEN_REQUEST:
    case GET_PROFILE_REQUEST:
    case GET_PARTIAL_PROFILE_REQUEST:
    case MODIFY_PROFILE_REQUEST:
      return update(state, {
        loading: { $set: true },
        error: { $set: null }
      });

    case VALIDATE_TOKEN_SUCCESS:
    case GET_PROFILE_SUCCESS:
    case MODIFY_PROFILE_SUCCESS:
      return update(state, {
        loading: { $set: false },
        profile: {
          _id: { $set: action.payload.user._id },
          firstName: { $set: action.payload.user.profile.firstName },
          lastName: { $set: action.payload.user.profile.lastName },
          userName: { $set: action.payload.user.github.userName },
          email: { $set: action.payload.user.github.email },
          avatarUrl: { $set: action.payload.user.profile.avatarUrl }
        },
        error: { $set: null }
      });

    case GET_PARTIAL_PROFILE_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        partialProfile: {
          userName: { $set: action.payload.userName },
          avatarUrl: { $set: action.payload.avatarUrl }
        },
        error: { $set: null }
      });

    case VALIDATE_TOKEN_FAILURE:
    case GET_PROFILE_FAILURE:
    case GET_PARTIAL_PROFILE_FAILURE:
    case MODIFY_PROFILE_FAILURE:
      console.log(action.type);
      console.log(action.payload);
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      console.log(error);
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        error: { $set: error }
      });

    default:
      return state;
  }
}

export default profile;
