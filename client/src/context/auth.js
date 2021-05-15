import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
};

if (localStorage.getItem("jwt")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwt"));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwt");
  } else {
    initialState.user = decodedToken;
  }
}
const AuthContext = createContext({
  user: null,
  login: (login) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT": {
      return {
        ...state,
        user: null,
      };
    }
    default:
      return state;
  }
}

function AuthProvider(props) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData) => {
    localStorage.setItem("jwt", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  };

  const logout = (data) => {
    localStorage.removeItem("jwt");
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
