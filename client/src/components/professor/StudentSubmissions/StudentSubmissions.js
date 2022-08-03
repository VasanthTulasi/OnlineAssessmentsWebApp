import React from 'react';
import ViewAssessments from "./ViewAssessments";
import ViewSubmissions from "./ViewSubmissions";
import EvaluateSubmission from "./EvaluateSubmission";
import { Route, Routes } from "react-router-dom";

function StudentSubmissions() {
  return (
      <Routes>
        <Route path="/viewAssessments" element={<ViewAssessments/>}/>
        <Route path="/viewSubmissions" element={<ViewSubmissions/>}/>
        <Route path="/evaluateSubmission" element={<EvaluateSubmission/>}/>
      </Routes>
  )
}

export default StudentSubmissions