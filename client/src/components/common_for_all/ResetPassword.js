import React, { useState } from "react";
import Instructions from "./Instructions";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import LoginRightBGImage from "../../svgs/right_background.svg";
import Axios from "axios";

function ResetPassword() {
  const tokenFromURL = useParams().token;
  const [newPassword, setNewPassword] = useState("");
  const [reenterNewPassword, setReenterNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/users",
    crossDomain: true,
  });

  const saveNewPassword = () => {
    let errorMessageString = "";
    let validPwd = /^(?=.*\W)(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?!.* ).{8,16}$/;
    if (newPassword === "" || reenterNewPassword === "") {
      errorMessageString +=
        "Fields cannot be empty. Both the fields must be filled.\n\n";
    }
    if (newPassword.length < 8) {
      errorMessageString += "Password should contain atleast 8 characters.\n\n";
    }
    if (newPassword !== reenterNewPassword) {
      errorMessageString +=
        "Password and Re-enter password fields do not match.\n\n";
    }
    if (!newPassword.match(validPwd))
      errorMessageString +=
        "Password should contain at least 8 digits, one lower case letter,\n one upper case letter and one special character.\n\n";

    if (errorMessageString !== "") {
      setMessage("Error(s):\n\n" + errorMessageString);
      return;
    } else {
      setMessage("");
    }

    axios
      .post("/resetPassword", {
        password: newPassword,
        resetToken: tokenFromURL,
      })
      .then((res) => {
        if (res.data.message === "password reset successful") {
          setMessage(
            "Your password reset is successful. Please login using your new password."
          );
        } else if (res.data.message === "link expired") {
          setMessage(
            "This link is expired.\nPlease request for a new password reset link using 'Forgot Password' operation."
          );
        }
      });
  };

  return (
    <MainDiv>
      <Instructions page="resetPassword" />
      <ResetPasswordSection>
        <div className="reset-password-heading">
          <span>Reset Password</span>
        </div>
        <div className="reset-password-card">
          <label className="reset-password-label">Enter New Password</label>
          <input
            type="password"
            className="reset-password-text-field"
            placeholder="New Password"
            id="reset_password"
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <label className="reset-confirm-password-label">
            Re-enter New Password
          </label>
          <input
            type="password"
            className="reset-confirm-password-text-field"
            placeholder="Re-enter New Password"
            id="reset_confirm_password"
            onChange={(event) => setReenterNewPassword(event.target.value)}
          />
          {message && <div className="error-message">{message}</div>}
          <button
            className="save-new-password-button"
            onClick={saveNewPassword}
          >
            SUBMIT
          </button>
        </div>
      </ResetPasswordSection>
    </MainDiv>
  );
}

const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ResetPasswordSection = styled.div`
  background-image: url("${LoginRightBGImage}");
  background-repeat: no-repeat;
  background-size: auto;
  height: 100vh;
  flex: 6;
  display: flex;
  align-items: center;
  flex-direction: column;

  .reset-password-heading {
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

  .reset-password-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex: 7;
  }

  .reset-password-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .reset-confirm-password-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .reset-password-text-field {
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

  .reset-confirm-password-text-field {
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

  .save-new-password-button {
    margin-top: 30px;
    margin-bottom: 30px;
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

  .save-new-password-button:hover {
    cursor: pointer;
  }

  .error-message {
    color: red;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
    border: 1px solid red;
    border-radius: 8px;
    width: 100%;
    padding: 10px;
    white-space: pre-line;
  }
`;

export default ResetPassword;
