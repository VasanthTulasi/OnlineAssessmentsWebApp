import React, { useState } from "react";
import Instructions from "./Instructions";
import Login from "./Login";
import styled from "styled-components";
import Register from "./Register";
import RegistrationRequested from "./RegistrationRequested";
import ForgotPassword from "./ForgotPassword";
import { LandingContext } from "../../contexts/LandingContext";

function LandingPage() {
  const [currentSection, setCurrentSection] = useState("login");
  return (
    <MainDiv>
      <Instructions />
      <LandingContext.Provider value={{ setCurrentSection }}>
        {currentSection === "login" && <Login />}
        {currentSection === "register" && <Register />}
        {currentSection === "registrationrequested" && <RegistrationRequested />}
        {currentSection === "forgotpassword" && <ForgotPassword />}
      </LandingContext.Provider>
    </MainDiv>
  );
}

const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export default LandingPage;
