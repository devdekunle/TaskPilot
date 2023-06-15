import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { SkeletonTheme } from "react-loading-skeleton";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f3f3f3">
        <App />
      </SkeletonTheme>
    </Provider>
  </React.StrictMode>
);
