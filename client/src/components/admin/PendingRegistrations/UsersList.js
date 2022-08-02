import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BodyImage from "../../../svgs/body_background.svg";
import Axios from "axios";

function UsersList() {
  const navigate = useNavigate();
  let [pendingUsersArray, setPendingUsersArray] = useState([]);
  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/pendingregistrations",
    crossDomain: true,
  });

  const gotoUserProfile = (event) => {
    const itemIndex = event.currentTarget.id.split("_")[1];
    navigate("../userprofile", {
      state: {
        first_name: pendingUsersArray[itemIndex].first_name,
        last_name: pendingUsersArray[itemIndex].last_name,
        email: pendingUsersArray[itemIndex].email,
        uni_id: pendingUsersArray[itemIndex].uni_id,
        password: pendingUsersArray[itemIndex].password,
        role: pendingUsersArray[itemIndex].role,
      },
    });
  };

  useEffect(() => {
    console.log("triggered");
    axios.get("/listofpendingusers").then((res) => {
      setPendingUsersArray(res.data);
    });
  }, []);

  return (
    <Users>
      <div className="pending-registrations-heading">
        Pending User Registations
      </div>
      <table className="user-data-content">
        <tbody>
          <tr>
            <td className="user-data-start bgcolor">S. No</td>
            <td className="user-data-mid bgcolor">First Name</td>
            <td className="user-data-mid bgcolor">Last Name</td>
            <td className="user-data-end bgcolor">Role</td>
          </tr>
          {pendingUsersArray.map((ele, index) => {
            return (
              <tr>
                <td className="user-data-start">{index + 1}</td>
                <td className="user-data-mid">{ele.first_name}</td>
                <td className="user-data-mid">{ele.last_name}</td>
                <td className="user-data-end">{ele.role}</td>
                <td>
                  <button
                    id={"viewButton_" + index}
                    className="user-data-button"
                    onClick={gotoUserProfile}
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
          {pendingUsersArray.length === 0 && (
            <tr>
              <td colSpan="4" className="user-data-no-users">No pending users</td>
            </tr>
          )}
        </tbody>
      </table>
    </Users>
  );
}

const Users = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #282c34;
  color: #61dafb;
  padding-top: 72px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 20px;
  flex-direction: column;
  margin-top: 30px;

    .pending-registrations-heading {
      color: white;
      font-family: "Source Sans Pro", sans-serif;
      font-weight: 400;
      font-size: 20px;
      /* border: 1px solid red; */
      vertical-align: middle;
      /* text-decoration: underline; */
    }

  .user-data-content {
    color: white;
    /* border: 1px solid red; */
    margin-top: 25px;
    width: 75%;
    /* border: 1; */
    border-collapse: separate;
    /* border-spacing: 0 25px; */
    border-spacing: 0;
  }

  .user-data-start {
    border: 1px solid white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 15px;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    background-color: #282c34;
  }

  .user-data-mid {
    border: 1px solid white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 15px;
    background-color: #282c34;
  }

  .user-data-end {
    border: 1px solid white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
    padding: 15px;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    background-color: #282c34;
  }

  .user-data-no-users{
    border: 1px solid white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
    padding: 15px;
    background-color: #282c34;
    border-radius: 15px;
    text-align: center;
  }

  .user-data-button {
    margin-left: 15px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 600;
    width: max-content;
    /* height: 45px; */
    /* letter-spacing: 1px; */
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
  }

  .user-data-button:hover {
    cursor: pointer;
  }

  .bgcolor {
    color: #61dafb;
  }
`;

export default UsersList;
