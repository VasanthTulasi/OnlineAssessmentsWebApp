import React, { useEffect, useContext } from "react";
import styled from "styled-components";
import BodyImage from "../../svgs/body_background.svg";
import { LoginContext } from "../../contexts/LoginContext";
import ProfileData from "../common_for_all/ProfileData";

function MyProfile() {
  const { loggedInUserDetails } = useContext(LoginContext);
  const userObj = loggedInUserDetails;
  return (
    <Profile>
      <div className="profile-heading">My Profile</div>
      <ProfileData userData = {userObj}/>
      <button className="change-password-button">Change Password</button>
    </Profile>
  );
}

const Profile = styled.div`
  height: 100vh;
  width: 100%;
  /* background-color: #282c34; */
  background-image: url("${BodyImage}");
  background-repeat: no-repeat;
  background-size: cover;
  color: #61dafb;
  /* font-size: 50px; */
  padding-top: 72px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 20px;
  /* border: 1px solid red; */
  flex-direction: column;
  margin-top: 30px;

  .profile-heading {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 25px;
    /* border: 1px solid red; */
    vertical-align: middle;
    /* text-decoration: underline; */
  }

  .profile-content {
    color: white;
    /* border: 1px solid red; */
    margin-top: 25px;
    width: 50%;
    /* border: 1; */
    border-collapse: separate;
    border-spacing: 0 25px;
  }

  .user-data-heading {
    border: 1px solid white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
    padding: 15px;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    background-color: #282c34;
  }

  .user-data-value {
    border: 1px solid white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
    border-left: 0;
    padding: 15px;
    /* background-color: #61dafb; */
    color: #61dafb;
    /* color: #f2cc8f; */
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    background-color: #282c34;
  }

  .change-password-button {
    margin-top: 25px;
    border: 1px solid black;
    /* border: 1px solid white; */
    color: #282c34;
    /* color: black; */
    /* color: #61dafb; */
    /* background-color: #61dafb; */
    /* background-color: #f2cc8f; */
    background-color: white;

    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 600;
    width: max-content;
    height: 45px;
    /* letter-spacing: 1px; */
    border-radius: 25px;
    padding: 0 20px 0 20px;
  }

  .change-password-button:hover {
    cursor: pointer;
  }
`;

export default MyProfile;
