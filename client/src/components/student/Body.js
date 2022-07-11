import React from "react";
import {Route, Routes } from "react-router-dom";
import Modules from "./Modules";
import Exams from "./Exams";
import Results from "./Results";
import Profile from "../common_for_all/MyProfile/MyProfile";
import NavBar from '../common_for_all/Navbar'

function Body() {
  return (
    <>
      <NavBar />
      <Routes>
          <Route exact path="/" element={<Modules />} />
          <Route exact path="/modules" element={<Modules />} />
          <Route exact path="/exams" element={<Exams />} />
          <Route exact path="/results" element={<Results />} />
          <Route exact path="/myprofile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default Body;
