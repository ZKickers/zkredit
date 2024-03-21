import { useState, useEffect } from "react";
import React from "react";
import { getUser } from "api/auth.api";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  username: "",
  accountId: "",
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [accountId, setAccountId] = useState("");
  const isLoggedIn = token.length !== 0;

  async function fetchUser(token) {
    const user = await getUser(token);
    setUsername(user.username);
    setAccountId(user.accountId);
  }

  const loginHandler = async (token) => {
    await fetchUser(token);
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logoutHandler = () => {
    setToken("");
    localStorage.setItem("token", token);
  };

  const isLogIn = async () => {
    try {
      let savedToken = await localStorage.getItem("token");
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
