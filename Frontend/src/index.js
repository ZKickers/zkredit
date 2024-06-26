import React from "react";
import ReactDOM from "react-dom/client";
import App from "App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import { NavigationProvider } from "contexts/NavigationContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const element = document.getElementById("root");
const root = ReactDOM.createRoot(element);

root.render(
    <NavigationProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </NavigationProvider>
);
