import React,{useContext} from "react";
import styled from "styled-components";
import LoginRightBGImage from "../../svgs/right_background.svg";
import { LandingContext } from "../../contexts/LandingContext";

function RegistrationRequested() {
    const { setCurrentSection } = useContext(LandingContext);


const backToLoginPage = () =>{
    setCurrentSection("login");
}

  return (
    <RegistrationRequestedSection>
      <div className="registration-requested-heading">
        <span>Registration Request Sent</span>
      </div>
      <div className="registration-requested-card">
        <label className="registration-requested-email-label">
          Your request for registration has been noted successfully and it is
          currently <b>pending approval from the admin</b>. You will receive an email notification about
          the activation of your account after the admin approval. Please keep checking your email inbox. Thank you.
        </label>
        <button
          className="password-reset-button"
          onClick={backToLoginPage}
        >
          BACK TO LOGIN PAGE
        </button>
      </div>
    </RegistrationRequestedSection>
  );
}

const RegistrationRequestedSection = styled.div`
  background-image: url("${LoginRightBGImage}");
  background-repeat: no-repeat;
  background-size: auto;
  height: 100vh;
  flex: 6;
  display: flex;
  align-items: center;
  flex-direction: column;

  .registration-requested-heading {
    margin-top: 70px;
    /* border: 2px solid blue; */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    flex: 3;
    color: #282c34;
    font-family: "Sora", sans-serif;
    font-size: 32px;
    /* border: 1px solid red; */
  }

  .registration-requested-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex: 7;
  }

  .registration-requested-email-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
    /* border: 1px solid red; */
    margin-left: 100px;
    margin-right: 100px;
  }

  .password-reset-button {
    margin-top: 30px;
    border: 1px solid #282c34;
    /* border: 0px; */
    color: white;
    background-color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 14px;
    font-weight: 500;
    width: 500px;
    height: 45px;
    letter-spacing: 3px;
    border-radius: 5px;
  }

  .password-reset-button:hover {
    cursor: pointer;
  }
`;

export default RegistrationRequested;
