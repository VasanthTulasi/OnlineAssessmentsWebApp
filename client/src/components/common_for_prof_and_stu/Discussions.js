import React from 'react';
import ViewAssessments from "./ViewAssessments";
import ViewQuestions from "./ViewQuestions";
import ViewDiscussions from "./ViewDiscussions";
import { Route, Routes } from "react-router-dom";

function Discussions() {
  return (
      <Routes>
        <Route path="/viewAssessments" element={<ViewAssessments/>}/>
        <Route path="/viewDiscussions" element={<ViewDiscussions/>}/>
        <Route path="/viewQuestions" element={<ViewQuestions/>}/>
      </Routes>
  )
}

export default Discussions