import React, { useContext } from "react";
import styled from "styled-components";
import LoginRightBGImage from "../../svgs/right_background.svg";
import { useState, useEffect } from "react";
import Axios from "axios";
import { LandingContext } from "../../contexts/LandingContext";

function ForgotPassword() {
  const { setCurrentSection } = useContext(LandingContext);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [message, setMessage] = useState("");
  const [buttonDisplay, setButtonDisplay] = useState(null);

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/users",
    crossDomain: true,
  });

  const sendPasswordResetLink = async () => {
    setMessage("Password reset email is sent to your mail id.");
    setButtonDisplay({ display: "none" });
    return;
    axios
      .post("/forgotPassword", {
        email: forgotPasswordEmail,
      })
      .then((res) => {
        if (res.data.message === "password reset email sent")
          setMessage("Password reset email is sent to your mail id.");
        else if (res.data.message === "user not found")
          setMessage(
            "User does not exist with this email! Please enter a valid email."
          );
      });
  };

  const backToLoginPageClicked = async () => {
    setCurrentSection("login");
  };

  return (
    <ForgotPasswordSection>
      <div className="forgot-password-heading">
        <span>Forgot Password</span>
      </div>
      <div className="forgot-password-card">
        <label className="forgot-password-email-label" style={buttonDisplay}>
          Enter Your Registered Email
        </label>
        <input
          className="forgot-password-email-text-field"
          placeholder="Registered Email"
          id="register_email"
          onChange={(event) => setForgotPasswordEmail(event.target.value)}
          style={buttonDisplay}
        />
        {message && <div className="error-message">{message}</div>}
        <button
          className="password-reset-button"
          style={buttonDisplay}
          onClick={sendPasswordResetLink}
        >
          SEND PASSWORD RESET LINK
        </button>
        <div className="back-to-login-page" onClick={backToLoginPageClicked}>
          Back to Login Page
        </div>
      </div>
    </ForgotPasswordSection>
  );
}

const ForgotPasswordSection = styled.div`
  background-image: url("${LoginRightBGImage}");
  background-repeat: no-repeat;
  background-size: auto;
  height: 100vh;
  flex: 6;
  display: flex;
  align-items: center;
  flex-direction: column;

  .forgot-password-heading {
    margin-top: 70px;
    /* border: 2px solid blue; */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    flex: 2.5;
    color: #282c34;
    font-family: "Sora", sans-serif;
    font-size: 32px;
    /* border: 1px solid red; */
  }

  .forgot-password-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex: 7;
  }

  .forgot-password-email-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .forgot-password-email-text-field {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 18px;
    font-weight: 400;
    border: 1px solid #282c34;
    margin-top: 5px;
    border-radius: 2px;
    width: 500px;
    height: 40px;
    padding-left: 10px;
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
    width: 100%;
    height: 45px;
    letter-spacing: 3px;
    border-radius: 5px;
  }

  .password-reset-button:hover {
    cursor: pointer;
  }

  .back-to-login-page {
    margin-top: 5px;
    /* border: 1px solid red; */
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-decoration: underline;
  }

  .back-to-login-page:hover {
    cursor: pointer;
  }

  .error-message {
    color: red;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 15px;
    font-weight: 600;
    margin-top: 10px;
  }
`;

export default ForgotPassword;
