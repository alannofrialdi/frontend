import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";
import { Provider } from "react-redux";
import store from "./utils/store";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
