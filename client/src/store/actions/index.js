export const LOGOUT = "LOGOUT";
export const SET_LOGGEDIN = "SET_LOGGEDIN";
export const SET_REDIRECT_URL = "SET_REDIRECT_URL";
export const SET_SPINNER = "SET_SPINNER";

export function logout() {
  return {
    type: LOGOUT
  };
}

export function setLoggedIn() {
  return {
    type: SET_LOGGEDIN
  };
}

export function setRedirectUrl(url) {
  return {
    type: SET_REDIRECT_URL,
    payload: url
  };
}

export function setSpinner(spinnerClass) {
  return {
    type: SET_SPINNER,
    payload: spinnerClass
  };
}
