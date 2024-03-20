import { useState, useEffect } from "react";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUsername } from "api/auth.api";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  username: "",
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const isLoggedIn = token.length !== 0

  async function fetchUsername(token) {
    const username = await getUsername(token)
    setUsername(username);
  }


  const loginHandler = async (token) => {
    await fetchUsername(token);
    setToken(token);
    AsyncStorage.setItem('token',token);
  };

  const logoutHandler = () => {
    setToken("");
    AsyncStorage.setItem('token',"");
  };

  const isLogIn = async () => {
      try {
        let savedToken = await AsyncStorage.getItem('token');
        if (savedToken){
          await fetchUsername(savedToken)
          setToken(savedToken);
        }
        
      } catch (error) {
        console.log('is logged error ${error}');
      }
  }

  useEffect(() => {
    isLogIn();
  },[])

  const contextValue = {
    token,
    isLoggedIn,
    username,
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


