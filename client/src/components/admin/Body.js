import React from "react";
import styled from "styled-components";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Route, Routes } from "react-router-dom";
import Modules from "./ManageModules";
import Exams from "./Exams";
import Results from "./Results";
import NavBar from '../common_for_all/Navbar';
import ManageUsers from './ManageUsers'
import MyProfile from "../common_for_all/MyProfile/MyProfile";

function Body() {
  return (
    <>
      <NavBar />
      <Routes>
          <Route exact path="/" element={<ManageUsers />} />
          <Route exact path="/manageusers/*" element={<ManageUsers />} />
          <Route exact path="/managemodules" element={<Modules />} />
          <Route exact path="/myprofile/*" element={<MyProfile />} />
      </Routes>
    </>
  );
}

export default Body;
