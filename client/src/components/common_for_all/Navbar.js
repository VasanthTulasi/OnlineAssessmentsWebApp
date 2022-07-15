import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { LoginContext } from "../../contexts/LoginContext";
import Axios from "axios";
import { useNavigate } from 'react-router-dom';


function HomePage() {
  const { setIsUserLoggedIn, loggedInUserDetails } = useContext(LoginContext);
  const navigate = useNavigate();
  const role = loggedInUserDetails.role;
  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/users",
    crossDomain: true,
  });

  const signOutClicked = async () => {
    axios.get("/signOut").then((res) => {
      if (res.data.message !== "success")
        console.log("Sign out failed. Try again");
      else {
        setIsUserLoggedIn(false);
        navigate('/');
        console.log("Signout successful");
      }
    });
  };

  useEffect(() =>{
    if(role === "admin")
    navigate("/manageusers/userslist");
    console.log("affect");
  },[role]);

  return (
    <div>
      <MenuBar>
        <div className="app-name">AssessOnline</div>

        {role === "student" && (
          <ul className="menus">
            <li>
              <Link to="/modules" className="menu">
                Modules
              </Link>
            </li>
            <li>
              <Link to="/exams" className="menu">
                Exams
              </Link>
            </li>
            <li>
              <Link to="/results" className="menu">
                Results
              </Link>
            </li>
            <li>
              <Link to="/myprofile/profilecontent" className="menu">
                My Profile
              </Link>
            </li>
          </ul>
        )}

        {role === "professor" && (
          <ul className="menus">
            <li>
              <Link to="/modules" className="menu">
                PModules
              </Link>
            </li>
            <li>
              <Link to="/exams" className="menu">
                Exams
              </Link>
            </li>
            <li>
              <Link to="/results" className="menu">
                Results
              </Link>
            </li>
            <li>
              <Link to="/myprofile/profilecontent" className="menu">
                My Profile
              </Link>
            </li>
          </ul>
        )}

        {role === "admin" && (
          <ul className="menus">
            <li>
              <Link to="/manageusers/userslist" className="menu">
                Users Registations
              </Link>
            </li>
            <li>
              <Link to="/managemodules/vieweditmodules/viewmodules" className="menu">
                Manage Modules
              </Link>
            </li>
            <li>
              <Link to="/myprofile/profilecontent" className="menu">
                My Profile
              </Link>
            </li>
            
          </ul>
        )}

        <div className="profile-options">
          <div onClick={signOutClicked} className="signout">
            Sign Out
          </div>
        </div>
      </MenuBar>
    </div>
  );
}

const MenuBar = styled.div`
  display: flex;
  background: #282c34;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  width: 100%;
  position: fixed;
  top: 0;
  height: 72px;
  border-bottom: 1px solid #61dafb;

  .app-name {
    font-family: "Sora", sans-serif;
    /* font-family: "Fascinate Inline", cursive; */
    font-size: 26px;
    color: #61dafb;
    margin-left: 20px;
    flex: 3;
  }

  .menus {
    display: flex;
    justify-content: flex-end;
    list-style-type: none;
    flex: 7;
  }

  .profile-options {
    display: flex;
    justify-content: space-evenly;
    flex: 1;
  }

  .menu {
    padding: 15px;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 15px;
    /* color: #61dafb; */
    color: white;
    letter-spacing: 1px;
    text-decoration: none;
  }

  .menu:hover {
    color: #282c34;
    border: 1px solid #84f7d1;
    cursor: pointer;
    padding: 5px 14px 5px 14px;
    /* border-radius: 0 20px 0 20px; */
    border-radius: 20px;
    background-color: #61dafb;
    font-weight: 600;
  }

  .signout {
    /* border: 1px solid cornflowerblue; */
    color: #0b1118;
    /* background: #84f7d1; */
    /* background-color: #f4ac45; */
    /* background-color: #0CF574; */
    background-color: #f2cc8f;
    /* background-color: #C5D86D; */
    /* background-color: ; */
    border-radius: 20px;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 600;
    font-size: 15px;
    /* letter-spacing: 1px; */
    padding: 6px 15px 6px 15px;
    border-radius: 20px;
  }

  /* Register onhover */
  .signout:hover {
    cursor: pointer;
    color: #282c34;
    background-color: #61dafb;
    /* font-weight: 600; */
    /* border-radius:0 20px 0 20px; */
  }
`;

export default HomePage;
