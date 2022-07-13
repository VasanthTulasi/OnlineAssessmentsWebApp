import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "axios";
import ConfirmDeleteModal from "./ConfirmDeletionModal";

function ViewUsersForModules() {
  let [moduleUsersArray, setModuleUsersArray] = useState([]);
  let [moduleCode, setModuleCode] = useState("");
  const [isModalVisible, setisModalVisible] = useState(false);
  const [deletionIndex, setDeletionIndex] = useState();

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/modules",
    crossDomain: true,
  });

  const deleteUser = (event) => {
    setDeletionIndex(event.currentTarget.id.split("_")[1]);
    setisModalVisible(true);
  };

  const confirmedUserDeletion = () => {
    setisModalVisible(false);
    const itemIndex = deletionIndex;
    axios
      .post("/deleteModule", {
        module_code: moduleUsersArray[itemIndex].module_code,
      })
      .then((res) => {
        if (res.data.message === "success") {
          alert("Module deleted succesfully!");
          const modModulesArray = moduleUsersArray;
          modModulesArray.splice(itemIndex, 1);
          console.log("New Array is " + JSON.stringify(modModulesArray));
          setModuleUsersArray([...modModulesArray]);
        } else alert("Error: " + res.data.message);
      });
  };

  return (
    <>
      {isModalVisible && (
        <ConfirmDeleteModal
          setModalVisibility={() => setisModalVisible(false)}
          userInfo={moduleUsersArray[deletionIndex].uni_id}
          confirmedDeletion={confirmedUserDeletion}
        />
      )}
      <ViewEditMod>
        <div>View Users For Modules</div>
        <div class="whole-content">
          <label className="select-module-label">Select Module Code</label>
          <input
            className="select-module-text-field"
            placeholder="Module Code"
            onChange={(event) => setModuleCode(event.target.value)}
            value={moduleCode}
          />
          <div style={{ fontSize: "17px" }}>Users for the selected module:</div>
          <table className="module-data-content">
            <tbody>
              <tr>
                <td className="module-data start headers-color">S. No</td>
                <td className="module-data headers-color">Module Code</td>
                <td className="module-data headers-color">Module Title</td>
                <td className="module-data headers-color">Year</td>
                <td className="module-data end headers-color">Sem</td>
              </tr>
              {moduleUsersArray.map((ele, index) => {
                return (
                  <tr>
                    <td className="module-data start">{index + 1}</td>
                    <td className="module-data mid">{ele.module_code}</td>
                    <td className="module-data mid">{ele.module_title}</td>
                    <td className="module-data mid">{ele.module_year}</td>
                    <td className="module-data end">{ele.module_semester}</td>
                    <td>
                      <button
                        id={"deleteButton_" + index}
                        className="module-data-button"
                        onClick={deleteUser}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {moduleCode !== "" && moduleUsersArray.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-user-data">
                    No users for this module
                  </td>
                </tr>
              )}

              {moduleCode === "" && (
                <tr>
                  <td colSpan="5" className="no-user-data">
                    No module selected. Please select a module first to see its users.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ViewEditMod>
    </>
  );
}

const ViewEditMod = styled.div`
  height: 100%;
  width: 100%;
  background-color: #282c34;
  color: #61dafb;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 20px;
  flex-direction: column;
  overflow-y: auto;

  div {
    margin-top: 30px;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
  }
  .whole-content {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    /* border:1px solid red; */
    width: 75%;
  }

  .select-module-label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
    /* border:1px solid red; */
  }

  .select-module-text-field {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    border: 1px solid #282c34;
    margin-top: 5px;
    border-radius: 5px;
    width: 500px;
    height: 35px;
    padding-left: 10px;
  }

  .module-data-content {
    color: white;
    /* border: 1px solid red; */
    margin-top: 5px;
    width: 100%;
    /* border: 1; */
    border-collapse: separate;
    /* border-spacing: 0 25px; */
    border-spacing: 0;
    /* border:1px solid red; */
  }

  .module-data {
    border: 1px solid white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 10px;
    background-color: #282c34;
  }

  .start {
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
  }

  .end {
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
  }

  .module-data-button {
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

  .no-user-data{
    border: 1px solid white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 15px;
    background-color: #282c34;
    border-radius: 15px;
    text-align: center;
  }

  .module-data-button {
    cursor: pointer;
  }

  .headers-color {
    color: #61dafb;
  }
`;

export default ViewUsersForModules;
