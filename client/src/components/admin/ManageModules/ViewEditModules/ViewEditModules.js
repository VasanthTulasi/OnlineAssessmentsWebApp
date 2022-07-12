import React from "react";
import { Route, Routes } from "react-router-dom";
import ViewModules from "./ViewModules";
import EditModule from "./EditModule";

function ViewEditModules() {
  return (
    <Routes>
      <Route path="/viewmodules" element={<ViewModules />} />
      <Route path="/editmodule" element={<EditModule />} />
    </Routes>
  )
}

export default ViewEditModules