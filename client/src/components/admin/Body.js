import React from "react";
import {Route, Routes } from "react-router-dom";
import ManageModules from "./ManageModules/ManageModules";
import NavBar from '../common_for_all/Navbar';
import ManageUsers from './PendingRegistrations/ManageUsers'
import MyProfile from "../common_for_all/MyProfile/MyProfile";

function Body() {
  return (
    <>
      <NavBar />
      <Routes>
          <Route exact path="/" element={<ManageUsers />} />
          <Route exact path="/manageusers/*" element={<ManageUsers />} />
          <Route exact path="/managemodules/*" element={<ManageModules />} />
          <Route exact path="/myprofile/*" element={<MyProfile />} />
      </Routes>
    </>
  );
}

export default Body;
