import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ResetPassword from "./components/common_for_all/ResetPassword";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ActivateUserAccount from "./components/common_for_all/ActivateUserAccount";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Router>
      <Routes>
        <Route path="*" element={<App />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/accountActivate/:token" element={<ActivateUserAccount />} />
      </Routes>
    </Router>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
