import React from "react";
import { useState, useEffect } from "react";
import StudentBody from "./components/student/Body";
import AdminBody from "./components/admin/Body";
import ProfessorBody from "./components/professor/Body";
import LandingPage from "./components/common_for_all/LandingPage";
import { LoginContext } from "./contexts/LoginContext";

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});

  {
    /*
  Title: React Context Api Usage
  Author: Savannah TechStack
  Date: 29-Jun-2022
  Source: https://blog.devgenius.io/react-context-api-using-typescript-9d54e1c921dd
  Details: Although the above blog implements the functionality in typescript, implementation below is done in JavaScript.
  */
  }
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
}

export default App;
