import { combineReducers } from "redux";
import appState from "../reducers/appState";
import profile from "../reducers/profile";
import pin from "../reducers/pin";

const rootReducer = combineReducers({
  appState,
  profile,
  pin
});

export default rootReducer;
