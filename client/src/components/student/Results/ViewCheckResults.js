import React from 'react';
import ViewAssessments from "./ViewAssessments";
import CheckResult from "./CheckResult";
import { Route, Routes } from "react-router-dom";

function ViewEditAssessments() {
  return (
      <Routes>
        <Route path="/viewAssessments" element={<ViewAssessments/>}/>
        <Route path="/checkResult" element={<CheckResult/>}/>
      </Routes>
  )
}

export default ViewEditAssessments