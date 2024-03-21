import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import { AuthContextProvider } from "store/auth-context";
import App from "App";
import { NavigationProvider } from "contexts/NavigationContext";

const element = document.getElementById("root");
const root = ReactDOM.createRoot(element);

root.render(
    <AuthContextProvider>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </AuthContextProvider>
);
