import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import App from "App";
import { NavigationProvider } from "contexts/NavigationContext";

const element = document.getElementById("root");
const root = ReactDOM.createRoot(element);

root.render(
  <NavigationProvider>
    <App />
  </NavigationProvider>
);
