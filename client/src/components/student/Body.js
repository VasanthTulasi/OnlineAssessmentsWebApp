import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import ViewTakeAssessments from "./ViewTakeAssessments/ViewTakeAssessments";
import ViewCheckResults from "./Results/ViewCheckResults";
import Profile from "../common_for_all/MyProfile/MyProfile";
import NavBar from "../common_for_all/Navbar";
import { AssessmentContext } from "../../contexts/AssessmentContext";

function Body() {
  const [navLinksStyle, setNavLinksStyle] = useState("menu");
  return (
    <>
      <AssessmentContext.Provider
        value={{
          setNavLinksStyle,
        }}
      >
        <NavBar navLinksAccess={navLinksStyle} />
        <Routes>
          <Route
            exact
            path="/viewTakeAssessments/*"
            element={<ViewTakeAssessments />}
          />
          <Route
            exact
            path="/viewCheckResults/*"
            element={<ViewCheckResults />}
          />
          <Route exact path="/myprofile/*" element={<Profile />} />
        </Routes>
      </AssessmentContext.Provider>
    </>
  );
}

export default Body;
