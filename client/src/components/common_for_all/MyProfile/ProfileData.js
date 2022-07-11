import React from "react";
import styled from "styled-components";

function ProfileData(props) {
  const user = props.userData;

return user === undefined ?  <div>Profile data not found</div> : (
      <table className="profile-content">
        <tr>
          <td className="user-data-heading">First Name</td>
          <td className="user-data-value">{user.first_name }</td>
        </tr>
        <tr>
          <td className="user-data-heading">Last Name</td>
          <td className="user-data-value">{user.last_name}</td>
        </tr>
        <tr>
          <td className="user-data-heading">Email</td>
          <td className="user-data-value">{user.email}</td>
        </tr>
        <tr>
          <td className="user-data-heading">University ID Number</td>
          <td className="user-data-value">{user.uni_id}</td>
        </tr>
      </table>
  )
}

export default ProfileData;
