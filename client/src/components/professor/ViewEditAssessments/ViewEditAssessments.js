import React from "react";
import ViewAssessments from "./ViewAssessments";
import EditAssessments from "./EditAssessments";
import ReviewAssessment from "./ReviewAssessment";
import { Route, Routes } from "react-router-dom";

function ViewEditAssessments() {
  return (
    <Routes>
      <Route path="/viewAssessments" element={<ViewAssessments />} />
      <Route path="/editAssessments" element={<EditAssessments />} />
      <Route path="/reviewAssessment" element={<ReviewAssessment />} />
    </Routes>
  );
}

export default ViewEditAssessments;
