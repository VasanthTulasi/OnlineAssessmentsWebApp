import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "axios";
import ConfirmDeleteModal from "./ConfirmDeletionModal";
import { useNavigate } from "react-router-dom";
import SingleSelect from "react-select";
import CreatableSelect from 'react-select/creatable';


function ViewUsersForModules() {
  let [moduleCode, setModuleCode] = useState("");
  let [addedUsers, setAddedUsers] = useState([]);
  let [newUsers, setNewUsers] = useState([]);
  const [isModalVisible, setisModalVisible] = useState(false);
  const navigate = useNavigate();
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "gdfsj", label: "Vanilla" },
    { value: "strawbegasdrry", label: "Strawberry" }
  
  ];

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/modules",
    crossDomain: true,
  });

  const removeUser = () => {};
  const saveUsers = () => {};
  const goBackOperation = () => {
    navigate("../vieweditmodules/viewmodules");
  };

  const selectedModule = (selOption) => {
    setModuleCode(selOption.value);
  }

  const selectedUsers = (selOptions) => {
    const newUsersArray  = selOptions;
    const newUserIds = []
    newUsersArray.map((ele) => newUserIds.push(ele.value));
    setNewUsers(newUserIds);
  }
  

  const customStyles = {
    valueContainer: (provided) => ({
      ...provided,
      width: "400px",
      paddingLeft: "10px",
      color: "black",
      font: "17px",
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: "17px",
      fontWeight: 400,
      color: "#282c34",
    }),
    option: (provided) => ({
      ...provided,
      color: "black",
      font: "17px",
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: "17px",
      fontWeight: 400,
      color: "#282c34",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "17px",
    }),
    // singleValue: (provided, state) => {
    //   const opacity = state.isDisabled ? 0.5 : 1;
    //   const transition = 'opacity 300ms';
    //   return { ...provided, opacity, transition };
    // }
  };

  return (
    <ViewEditMod>
      <div className="heading">Assign Users To Modules</div>
      <div className="whole-content">
        <label className="select-module-label">Select Module</label>
        <div className="select-module-dropdown">
          <SingleSelect
            options={options}
            styles={customStyles}
            placeholder="Select or Enter Module Code"
            onChange={selectedModule}
          />
        </div>
        <label className="select-module-label">Select User(s)</label>
        <div className="select-module-dropdown">
          <CreatableSelect
            options={options}
            styles={customStyles}
            placeholder="Select or Enter User IDs"
            onChange={selectedUsers}
            isMulti
          />
        </div>
        {/* <div className="heading" style={{ fontSize: "17px" }}>User(s) to be added:</div> */}
        {/* <table className="module-data-content">
          <tbody>
            <tr>
              <td className="module-data start headers-color">S. No</td>
              <td className="module-data headers-color">Module Code</td>
              <td className="module-data headers-color">Module Title</td>
              <td className="module-data headers-color">Year</td>
              <td className="module-data end headers-color">Sem</td>
            </tr>
            {newUsers.map((ele, index) => {
              return (
                <tr>
                  <td className="module-data start">{index + 1}</td>
                  <td className="module-data mid">{ele.module_code}</td>
                  <td className="module-data mid">{ele.module_title}</td>
                  <td className="module-data mid">{ele.module_year}</td>
                  <td className="module-data end">{ele.module_semester}</td>
                  <td>
                    <button
                      id={"removeButton_" + index}
                      className="module-data-button"
                      onClick={removeUser}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
            {newUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="no-user-data">
                  No user(s) selected. Please select user(s) to be added for
                  this module.
                </td>
              </tr>
            )}
          </tbody>
        </table> */}
        <div className="add-new-users-buttons">
          <button className="button" onClick={saveUsers}>
            SAVE
          </button>
          <button className="button" onClick={goBackOperation}>
            CANCEL
          </button>
        </div>
      </div>
    </ViewEditMod>
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

  .heading {
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
  }

  .select-module-text-field {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    border: 1px solid #282c34;
    margin-top: 5px;
    border-radius: 5px;
    width: 400px;
    height: 35px;
    padding-left: 10px;
  }

  .select-module-dropdown {
    margin-top: 5px;
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

  .no-user-data {
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

  .add-new-users-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    /* border: 1px solid red; */
    width: 100%;
    margin-bottom: 20px;
  }

  .button {
    margin-top: 40px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 14px;
    font-weight: 600;
    width: max-content;
    height: 35px;
    border-radius: 25px;
    padding: 0 20px 0 20px;
  }

  .button:hover {
    cursor: pointer;
  }

  .datalist {
    width: 100px;
    border: 1px solid red;
  }
`;

export default ViewUsersForModules;
