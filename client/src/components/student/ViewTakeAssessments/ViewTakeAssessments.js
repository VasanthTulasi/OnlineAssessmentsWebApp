import React from 'react';
import ViewAssessments from "./ViewAssessments";
import TakeAssessments from "./TakeAssessments";
import { Route, Routes } from "react-router-dom";

function ViewEditAssessments() {
  return (
      <Routes>
        <Route path="/viewAssessments" element={<ViewAssessments/>}/>
        <Route path="/takeAssessments" element={<TakeAssessments/>}/>
      </Routes>
  )
}

export default ViewEditAssessments