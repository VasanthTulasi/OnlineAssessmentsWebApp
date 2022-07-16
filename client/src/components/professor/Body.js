import React, { useEffect } from "react";
import styled from "styled-components";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import CreateExams from "./CreateExams";
import EditExams from "./EditExams";
import StudentResults from "./StudentResults";
import MyProfile from "../common_for_all/MyProfile/MyProfile";
import NavBar from "../common_for_all/Navbar";

function Body() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route exact path="/createExams" element={<CreateExams />} />
        <Route exact path="/editExams" element={<EditExams />} />
        <Route exact path="/studentResults" element={<StudentResults />} />
        <Route exact path="/myprofile/*" element={<MyProfile />} />
      </Routes>
    </>
  );
}

export default Body;
