import React, { useEffect } from "react";
import styled from "styled-components";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import CreateAssessments from "./CreateAssessments";
import ViewEditAssessments from "./ViewEditAssessments/ViewEditAssessments";
import StudentSubmissions from "./StudentSubmissions/StudentSubmissions";
import Discussions from "../common_for_prof_and_stu/Discussions";
import MyProfile from "../common_for_all/MyProfile/MyProfile";
import NavBar from "../common_for_all/Navbar";

function Body() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route
          exact
          path="/createAssessments"
          element={<CreateAssessments />}
        />
        <Route
          exact
          path="/viewEditAssessments/*"
          element={<ViewEditAssessments />}
        />
        <Route
          exact
          path="/studentSubmissions/*"
          element={<StudentSubmissions />}
        />
        <Route exact path="/discussions/*" element={<Discussions />} />
        <Route exact path="/myprofile/*" element={<MyProfile />} />
      </Routes>
    </>
  );
}

export default Body;
