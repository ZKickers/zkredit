import { useState, useEffect } from "react";
import React from "react";
import { getUser } from "api/auth.api";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  username: "",
  accountId: "",
  createdAt: "",
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [accountId, setAccountId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const isLoggedIn = token.length !== 0;

  async function fetchUser(token) {
    const user = await getUser(token);
    setUsername(user.username);
    setAccountId(user.accountId);
    setCreatedAt(user.createdAt);
  }

  const loginHandler = async (token) => {
    console.log("login handler", token);
    sessionStorage.setItem("token", token)
    localStorage.setItem("token", token);
    setToken(token);
    await fetchUser(token);

  };

  const logoutHandler = () => {
    setToken("");
    setUsername("");
    setAccountId("");
    setCreatedAt("");
    sessionStorage.setItem("token", "")
    localStorage.setItem("token", "");
  };

  const isLogIn = async () => {
    try {
      let savedToken = localStorage.getItem("token");
      console.log("is logged in", savedToken);
      if (savedToken.length != 0) {
        sessionStorage.setItem("token", savedToken)

        console.log("is logged in", sessionStorage.getItem("token"));
        await fetchUser(savedToken);
        setToken(savedToken);
      }
    } catch (error) {
      console.log("is logged error", error);
    }
  };

  useEffect(() => {
    isLogIn();
  }, []);

  const contextValue = {
    token,
    isLoggedIn,
    username,
    accountId,
    createdAt,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
