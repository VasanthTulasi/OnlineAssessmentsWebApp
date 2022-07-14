import React,{useState} from "react";
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import ViewEditModules from "./ViewEditModules/ViewEditModules";
import AddNewModules from "./AddNewModules";
import ViewUsersForModules from "./ViewUsersForModules";
import AddNewUsers from "./AddNewUsers";
import { Link } from "react-router-dom";

function ManageModules() {
  
  
  return (
    <Modules>
      <div className="menus">
        <Link to="vieweditmodules/viewmodules" className="menu">
          View / Edit Modules
        </Link>
        <Link to="addnewmodules" className="menu" >
          Add New Modules
        </Link>
        <Link to="viewusersformodules" className="menu" >
          View Users for Modules
        </Link>
        <Link to="addnewusers" className="menu" >
          Assign Users to Modules
        </Link>
      </div>
      <div className="module-sub-page">
        <Routes>
          <Route path="/vieweditmodules/*" element={<ViewEditModules />} />
          <Route path="/addnewmodules" element={<AddNewModules />} />
          <Route path="/viewusersformodules" element={<ViewUsersForModules />} />
          <Route path="/addnewusers" element={<AddNewUsers />} />
        </Routes>
      </div>
    </Modules>
  );
}

const Modules = styled.div`
  height: 100vh;
  width: 100%;
  max-height: 100%;
  background-color: #282c34;
  color: #61dafb;
  padding-top: 72px;
  font-size: 20px;
  flex-direction: row;
  display: flex;
  /* border: 10px solid green; */

  .menus {
    display: flex;
    list-style-type: none;
    flex-direction: column;
    flex: 2;
    border-right: 1px solid #61dafb;
  }

  .menu:nth-child(1) {
    margin-top: 20px;
  }

  .menu {
    padding: 5px;
    margin: 10px 20px 10px 20px; 
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: white;
    letter-spacing: 1px;
    text-decoration: none;
    /* border: 1px solid red; */
    text-align: center;
    border-radius: 20px;
    background-color: #61dafb;
    color: #282c34;
  }

  .module-sub-page {
    /* border: 1px solid cyan; */
    flex: 8;
  }

  .no-highlight{
    background-color: #61dafb;
    color: #282c34;
  }

  .highlight{
    background-color: green;
    color: #282c34;
  }
`;

export default ManageModules;
