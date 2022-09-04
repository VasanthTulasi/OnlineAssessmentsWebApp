import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import StudentBody from "./components/student/Body";
import AdminBody from "./components/admin/Body";
import ProfessorBody from "./components/professor/Body";
import LandingPage from "./components/common_for_all/LandingPage";
import { LoginContext } from "./contexts/LoginContext";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});

  return (
    <LoginContext.Provider
      value={{
        setIsUserLoggedIn,
        loggedInUserDetails,
        setLoggedInUserDetails,
      }}
    >
      {!isUserLoggedIn ? (
        <LandingPage />
      ) : loggedInUserDetails.role === "student" ? (
        <StudentBody />
      ) : loggedInUserDetails.role === "professor" ? (
        <ProfessorBody />
      ) : loggedInUserDetails.role == "admin" ? (
        <AdminBody />
      ) : (
        <div>No Role Exists For User</div>
      )}
    </LoginContext.Provider>
  );

  // if (!authDataLoaded) {
  //   return null;
  // } else {
  //   if (loggedInUser) {
  //     getCurrentUserRole();
  //     if (loggedInUserRole === "admin") {
  //       return <AdminAssessment />;
  //     } else if (loggedInUserRole === "professor") {
  //       return <ProfessorAssessment />;
  //     } else if (loggedInUserRole === "student") {
  //       return <StudentBody />;
  //     }
  //   } else return <Login />;
  // }
  // return <LandingPage/>;
}

export default App;
