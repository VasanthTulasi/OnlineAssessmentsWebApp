import React from 'react';
import ViewAssessments from "./ViewAssessments";
import ViewSubmissions from "./ViewSubmissions";
import EvaluateSubmissions from "./EvaluateSubmissions";
import { Route, Routes } from "react-router-dom";

function StudentSubmissions() {
  return (
      <Routes>
        <Route path="/viewAssessments" element={<ViewAssessments/>}/>
        <Route path="/viewSubmissions" element={<ViewSubmissions/>}/>
        <Route path="/evaluateSubmissions" element={<EvaluateSubmissions/>}/>
      </Routes>
  )
}

export default StudentSubmissions