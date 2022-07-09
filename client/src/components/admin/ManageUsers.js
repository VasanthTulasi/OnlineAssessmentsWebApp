import React from "react";
import { Route, Routes } from "react-router-dom";
import UserProfile from "./UserProfile";
import UsersList from "./UsersList";

function ManageUsers() {
  return (
    <Routes>
      <Route path="/userslist" element={<UsersList />} />
      <Route path="/userprofile" element={<UserProfile />} />
    </Routes>
  );
}

export default ManageUsers;
