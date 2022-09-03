import React, { useState, useContext } from "react";
import styled from "styled-components";
import BodyImage from "../../../svgs/body_background.svg";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { LoginContext } from "../../../contexts/LoginContext";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reenterNewPassword, setreenterNewPassword] = useState("");
  const navigate = useNavigate();
  const { loggedInUserDetails } = useContext(LoginContext);
  const userEmail = loggedInUserDetails.email;
  const [message, setMessage] = useState("");

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/users",
    crossDomain: true,
  });

  const saveNewPassword = () => {
    let errorMessageString = "";
    if (
      currentPassword === "" ||
      newPassword === "" ||
      reenterNewPassword === ""
    ) {
      errorMessageString +=
        "Fields cannot be empty. All the fields must be filled.\n\n";
    }
    if (newPassword.length < 8) {
      errorMessageString +=
        "New Password should contain atleast 8 characters.\n\n";
    }
    if (newPassword !== reenterNewPassword) {
      errorMessageString +=
        "Password and Re-enter password fields do not match.\n\n";
    }
    if (errorMessageString !== "") {
      setMessage("Error(s):\n\n" + errorMessageString);
      return;
    } else {
      setMessage([]);
    }
    axios
      .post("/changePassword", { userEmail, currentPassword, newPassword })
      .then((res) => {
        if (res.data.message === "incorrect password")
          setMessage(
            "Password reset failed! Entered incorrect current password.\nPlease try again!"
          );
        else if (res.data.message === "success") {
          setMessage("Password changed successfully!");
          // navigate("../profilecontent");
        } else setMessage("Server Error. Please try again later.");
      });
  };

  const goBack = () => {
    navigate("../profilecontent");
  };

  return (
    <Main>
      <div className="change-password-heading">Change Password</div>
      <div className="change-password-card">
        <label className="change-password-label">
          Enter Your Current Password
        </label>
        <input
          className="change-password-text-field"
          placeholder="Current Password"
          type="password"
          onChange={(event) => setCurrentPassword(event.target.value)}
        />
        <label className="change-password-label">Enter New Password</label>
        <input
          className="change-password-text-field"
          placeholder="New Password"
          type="password"
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <label className="change-password-label">Re-enter New Password</label>
        <input
          className="change-password-text-field"
          placeholder="Re-enter New Password"
          type="password"
          onChange={(event) => setreenterNewPassword(event.target.value)}
        />
        {message && <div className="error-message">{message}</div>}
        <div className="change-password-buttons">
          <button className="button" onClick={saveNewPassword}>
            SAVE
          </button>
          <button className="button" onClick={goBack}>
            GO BACK
          </button>
        </div>
      </div>
    </Main>
  );
}

const Main = styled.div`
  height: 100vh;
  width: 100%;
  background-image: url("${BodyImage}");
  background-repeat: no-repeat;
  background-size: cover;
  color: #61dafb;
  padding-top: 72px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 20px;
  flex-direction: column;
  margin-top: 30px;

  .change-password-heading {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 25px;
    /* border: 1px solid red; */
    vertical-align: middle;
    /* text-decoration: underline; */
  }

  .change-password-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex: 7;
  }

  .change-password-label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .change-password-text-field {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 18px;
    font-weight: 400;
    border: 1px solid #282c34;
    margin-top: 5px;
    border-radius: 5px;
    width: 500px;
    height: 40px;
    padding-left: 10px;
  }

  .change-password-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    /* border: 1px solid red; */
    width: 100%;
  }

  .button {
    margin-top: 40px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 14px;
    font-weight: 600;
    width: max-content;
    height: 40px;
    border-radius: 25px;
    padding: 0 20px 0 20px;
  }

  .button:hover {
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
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
    border: 1px solid white;
    border-radius: 8px;
    width: 100%;
    padding: 10px;
    white-space: pre-line;
  }
`;

export default ChangePassword;
