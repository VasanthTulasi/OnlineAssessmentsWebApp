import React from "react";
import styled from "styled-components";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Route, Routes } from "react-router-dom";
import Modules from "./ManageModules";
import Exams from "./Exams";
import Results from "./Results";
import MyProfile from "./Profile";
import NavBar from '../common_for_all/Navbar';
import ManageUsers from './ManageUsers'

function Body() {
  return (
    <>
      <NavBar />
      <Routes>
          <Route exact path="/" element={<ManageUsers />} />
          <Route exact path="/manageusers/*" element={<ManageUsers />} />
          <Route exact path="/managemodules" element={<Modules />} />
      </Routes>
    </>
  );
}

export default Body;
