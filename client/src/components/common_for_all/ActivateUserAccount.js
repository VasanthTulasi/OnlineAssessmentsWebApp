import React, { useState, useEffect } from "react";
import Instructions from "./Instructions";
import Login from "./Login";
import styled from "styled-components";
import Register from "./Register";
import RegistrationRequested from "./RegistrationRequested";
import { LandingContext } from "../../contexts/LandingContext";
import { useParams } from "react-router-dom";
import LoginRightBGImage from "../../svgs/right_background.svg";
import Axios from "axios";

function ActivateUserAccount() {
  const tokenFromURL = useParams().token;
  const [accountInfo, setAccountInfo] = useState("Loading...");

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/pendingregistrations",
    crossDomain: true,
  });

  useEffect(() => {
    axios.post("/activateaccount", { token: tokenFromURL }).then((res) => {
      if (res.data.message === "success")
        setAccountInfo(
          "Hurray! Your OnlineAssess account is activated. You can now login to the application using the link provided to you earlier. Please reach out to the admin in case of any issues."
        );
      else setAccountInfo(res.data.message);
    });
  }, []);

  return (
    <MainDiv>
      <Instructions />
      <ResetPasswordSection>
        <div className="account-activated-heading">
          <span>Account Status</span>
        </div>
        <div className="account-activated-card">
          <label className="account-info-label">{accountInfo}</label>
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

  .account-activated-heading {
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

  .account-activated-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex: 7;
  }

  .account-info-label {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
    /* border: 1px solid red; */
    margin-left: 100px;
    margin-right: 100px;
  }
`;

export default ActivateUserAccount;
