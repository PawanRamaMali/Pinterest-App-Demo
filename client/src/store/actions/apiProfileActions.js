import { RSAA } from "redux-api-middleware";
import { BASE_URL } from "./apiConfig.js";

export const VALIDATE_TOKEN_REQUEST = "VALIDATE_TOKEN_REQUEST";
export const VALIDATE_TOKEN_SUCCESS = "VALIDATE_TOKEN_SUCCESS";
export const VALIDATE_TOKEN_FAILURE = "VALIDATE_TOKEN_FAILURE";
export const GET_PROFILE_REQUEST = "GET_PROFILE_REQUEST";
export const GET_PROFILE_SUCCESS = "GET_PROFILE_SUCCESS";
export const GET_PROFILE_FAILURE = "GET_PROFILE_FAILURE";
export const GET_PARTIAL_PROFILE_REQUEST = "GET_PARTIAL_PROFILE_REQUEST";
export const GET_PARTIAL_PROFILE_SUCCESS = "GET_PARTIAL_PROFILE_SUCCESS";
export const GET_PARTIAL_PROFILE_FAILURE = "GET_PARTIAL_PROFILE_FAILURE";
export const MODIFY_PROFILE_REQUEST = "MODIFY_PROFILE_REQUEST";
export const MODIFY_PROFILE_SUCCESS = "MODIFY_PROFILE_SUCCESS";
export const MODIFY_PROFILE_FAILURE = "MODIFY_PROFILE_FAILURE";

/*
* Function: validateToken - validates a token pulled from user's localStorage
*  by attempting to get the profile for the user ID stored locally.
* @param {string} token: the token from localStorage
* @param {string} userId: the userId from localStorage
* This action dispatches additional actions as it executes:
*   VALIDATE_TOKEN_REQUEST:
*     Initiates a spinner on the home page.
*   VALIDATE_TOKEN_SUCCESS:
*     Dispatched if the token was valid and the user object is returned.
*     This logs the user in, stores the token and sets the current
*     user profile.
*   VALIDATE_TOKEN_FAILURE: Dispatched if the token was invalid.
*     Logs the user out and deletes the values saved in localStorage.
*/
export function validateToken(token, userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/user/${userId}`,
      method: "GET",
      types: [
        VALIDATE_TOKEN_REQUEST,
        {
          type: VALIDATE_TOKEN_SUCCESS,
          meta: { token }
        },
        {
          type: VALIDATE_TOKEN_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { Authorization: `Bearer ${token}` }
    }
  };
}

export function getProfile(token, userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/user/${userId}`,
      method: "GET",
      types: [
        GET_PROFILE_REQUEST,
        GET_PROFILE_SUCCESS,
        {
          type: GET_PROFILE_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: { Authorization: `Bearer ${token}` }
    }
  };
}

export function getPartialProfile(userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/user/partial/${userId}`,
      method: "GET",
      types: [
        GET_PARTIAL_PROFILE_REQUEST,
        GET_PARTIAL_PROFILE_SUCCESS,
        {
          type: GET_PARTIAL_PROFILE_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

export function modifyProfile(token, userId, body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/user/${userId}`,
      method: "PUT",
      types: [
        MODIFY_PROFILE_REQUEST,
        MODIFY_PROFILE_SUCCESS,
        {
          type: MODIFY_PROFILE_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                if (data.error) {
                  message = data.error;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  };
}
