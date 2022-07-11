import React from "react";
import ProfileContent from "./ProfileContent";
import { Route, Routes } from "react-router-dom";
import ChangePassword from "./ChangePassword";


function MyProfile() {
  return (
    <Routes>
      <Route path="/profilecontent" element={<ProfileContent />} />
      <Route path="/changepassword" element={<ChangePassword />} />
    </Routes> 
  );
}



export default MyProfile;
