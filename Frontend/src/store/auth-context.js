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
    await fetchUser(token);
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logoutHandler = () => {
    setToken("");
    setUsername("");
    setAccountId("");
    setCreatedAt("");
    localStorage.setItem("token", "");
  };

  const isLogIn = async () => {
    try {
      let savedToken = localStorage.getItem("token");
      if (savedToken) {
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