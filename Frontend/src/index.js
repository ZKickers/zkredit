import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

const element = document.getElementById("root");
const root = ReactDOM.createRoot(element);

root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
