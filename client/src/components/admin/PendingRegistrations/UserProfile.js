import React, { useState, useRef } from "react";
import ProfileData from "../../common_for_all/MyProfile/ProfileData";
import BodyImage from "../../../svgs/body_background.svg";
import styled from "styled-components";
import { useLinkClickHandler, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import UserRejectModal from "./ConfirmUserRejectModal";

function UserProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const userObj = state;
  const [isModalVisible, setisModalVisible] = useState(false);
  const [message, setMessage] = useState("");
  const approveButton = useRef(null);
  const rejectButton = useRef(null);

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/pendingregistrations",
    crossDomain: true,
  });

  const goBack = () => {
    navigate("../userslist");
  };

  const approveUser = () => {
    console.log(userObj);
    axios.post("/approveregistration", userObj).then((res) => {
      if (res.data.message === "success") {
        setMessage("User registration approved successfully!");
        // navigate("../userslist");
        disableButtons();
      } else {
        setMessage(
          "Server Error: Unable to approve user. Please try again later!"
        );
        // navigate("../userslist");
      }
    });
  };

  const rejectUser = () => {
    setisModalVisible(true);
  };

  const confirmRejection = (reason) => {
    setisModalVisible(false);
    axios
      .post("/rejectregistration", {
        email: userObj.email,
        rejectionReason: reason,
      })
      .then((res) => {
        if (res.data.message === "success") {
          setMessage("User registration rejected successfully!");
          disableButtons();
          // navigate("../userslist");
        } else {
          setMessage(
            "Server Error: Unable to approve user. Please try again later!"
          );
          // navigate("../userslist");
        }
      });
  };

  const disableButtons = () => {
    approveButton.current.disabled = true;
    rejectButton.current.disabled = true;

    approveButton.current.style.backgroundColor = "gray";
    rejectButton.current.style.backgroundColor = "gray";
  };

  return (
    <Profile>
      {isModalVisible && (
        <UserRejectModal
          setModalVisibility={() => setisModalVisible(false)}
          confirmRejection={confirmRejection}
        />
      )}
      <div className="profile-heading">User Profile</div>
      <ProfileData userData={userObj} />
      {message && <div className="error-message">{message}</div>}
      <div>
        <button className="user-profile-buttons" onClick={goBack}>
          Go Back
        </button>
        <button
          ref={approveButton}
          className="user-profile-buttons"
          onClick={rejectUser}
          style={{ marginLeft: "30px", marginRight: "30px" }}
        >
          Reject
        </button>
        <button
          ref={rejectButton}
          className="user-profile-buttons"
          onClick={approveUser}
        >
          Approve
        </button>
      </div>
    </Profile>
  );
}

const Profile = styled.div`
  min-height: 100vh;
  width: 100%;
  height: auto;
  background-color: #282c34;
  /* background-image: url("${BodyImage}"); */
  /* background-repeat: no-repeat; */
  /* background-size: cover; */
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

  .user-profile-buttons {
    margin-top: 25px;
    margin-bottom: 25px;
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

  .user-profile-buttons:hover {
    cursor: pointer;
  }

  .error-message {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 10px;
    border: 1px solid white;
    padding: 10px;
    border-radius: 10px;
  }
`;

export default UserProfile;
