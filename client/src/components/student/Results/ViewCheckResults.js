import React from 'react';
import ViewAssessments from "./ViewAssessments";
import CheckResult from "./CheckResult";
import Dashboard from "./ViewDashboard";

import { Route, Routes } from "react-router-dom";

function ViewEditAssessments() {
  return (
      <Routes>
        <Route path="/viewAssessments" element={<ViewAssessments/>}/>
        <Route path="/checkResult" element={<CheckResult/>}/>
        <Route path="/viewDashboard" element={<Dashboard/>}/>
      </Routes>
  )
}

export default ViewEditAssessments