import React, { useEffect } from "react";
import styled from "styled-components";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import CreateAssessments from "./CreateAssessments";
import EditAssessments from "./EditAssessments";
import StudentResults from "./StudentResults";
import MyProfile from "../common_for_all/MyProfile/MyProfile";
import NavBar from "../common_for_all/Navbar";

function Body() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route exact path="/createAssessments" element={<CreateAssessments />} />
        <Route exact path="/editAssessments" element={<EditAssessments />} />
        <Route exact path="/studentResults" element={<StudentResults />} />
        <Route exact path="/myprofile/*" element={<MyProfile />} />
      </Routes>
    </>
  );
}

export default Body;
