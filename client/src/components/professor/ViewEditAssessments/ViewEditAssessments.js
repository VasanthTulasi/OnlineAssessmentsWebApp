import React from 'react';
import styled from "styled-components";
import ViewAssessments from "./ViewAssessments";
import EditAssessments from "./EditAssessments";
import { Route, Routes } from "react-router-dom";

function ViewEditAssessments() {
  return (
    <ViewEditAssess>
      <Routes>
        <Route path="/viewAssessments" element={<ViewAssessments/>}/>
        <Route path="/editAssessments" element={<EditAssessments/>}/>
      </Routes>
    </ViewEditAssess>
  )
}

const ViewEditAssess = styled.div`
  height: 100vh;
  width: 100%;
  background-color: #282c34;
  color: #61dafb;
  /* font-size: 50px; */
  padding-top: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

export default ViewEditAssessments