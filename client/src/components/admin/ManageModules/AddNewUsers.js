import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "axios";
import ConfirmDeleteModal from "./ConfirmDeletionModal";
import { useNavigate } from "react-router-dom";
import SingleSelect from "react-select";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

function ViewUsersForModules() {
  let [moduleCode, setModuleCode] = useState("");
  let [newUsers, setNewUsers] = useState([]);
  let [moduleCodesFromDB, setModuleCodesFromDB] = useState([]);
  let [usersFromDB, setUsersFromDB] = useState([]);
  let [usersSavedStatus, setUsersSavedStatus] = useState("");
  const [isModalVisible, setisModalVisible] = useState(false);
  const navigate = useNavigate();

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/modules",
    crossDomain: true,
  });

  const axios2 = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/users",
    crossDomain: true,
  });

  useEffect(() => {
    axios.get("/moduleCodes").then((res) => {
      let moduleCodes = res.data;
      moduleCodes = moduleCodes.map((ele) => {
        return { value: ele, label: ele };
      });
      setModuleCodesFromDB(moduleCodes);
    });
  }, []);

  useEffect(() => {
    if (moduleCode != "") {
      getUnassignedUsers(moduleCode);
    }
  }, [moduleCode]);

  const getUnassignedUsers = (moduleCode) => {
    console.log("Triggered");
    axios2
      .post("/getUnassignedUsers", { moduleCode: moduleCode })
      .then((res) => {
        setUsersFromDB([]);
        let users = res.data;
        users = users.map((ele) => {
          return { label: ele, value: ele };
        });
        console.log("unassigned users: " + JSON.stringify(users));
        setUsersFromDB([...users]);
      });
  };

  const saveUsers = () => {
    if (moduleCode === "" || newUsers.length === 0) {
      setUsersSavedStatus(
        "Fields cannot be empty. All the fields must be filled."
      );
      return;
    }
    axios.post("/assignUsers", { moduleCode, newUsers }).then((res) => {
      if (res.data.message === "success") {
        setUsersSavedStatus(
          "All the specified users are assigned to the module successfully."
        );
        getUnassignedUsers(moduleCode);
        setNewUsers([]);
      } else setUsersSavedStatus("Error: " + res.data.message);
    });
  };
  const goBackOperation = () => {
    navigate("../vieweditmodules/viewmodules");
  };

  const selectedModule = (selOption) => {
    setModuleCode(selOption.value);
  };

  const selectedUsers = (selOptions) => {
    const newUsersArray = selOptions;
    const newUserIds = [];
    newUsersArray.map((ele) => newUserIds.push(ele.value));
    setNewUsers(newUserIds);
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "400px",
      // paddingLeft: "10px",
      color: "black",
      font: "17px",
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: "17px",
      fontWeight: 400,
      color: "#282c34",
      // border: "1px solid red"
    }),
    option: (provided, state) => ({
      ...provided,
      // ...state,
      color: "black",
      font: "17px",
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: "17px",
      fontWeight: 400,
      color: "#282c34",
      backgroundColor: state.isSelected ? "#61dafb" : "white",
      "&:hover": {
        backgroundColor: "rgba(189,197,209,.3)",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "17px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      "&:hover": {
        backgroundColor: "#282c34",
        color: "white",
      },
    }),
  };

  function formatCreateLabel(value) {
    return 'Add User "' + value + '"';
  }

  return (
    <Main>
      <div className="add-new-user-heading">Assign Users to Modules</div>
      <div className="add-new-user-card">
        <label className="add-new-user-label">Select Module</label>
        <div className="select-module-dropdown">
          <SingleSelect
            options={moduleCodesFromDB}
            styles={customStyles}
            placeholder="Select or Enter Module Code"
            onChange={selectedModule}
            noOptionsMessage={() => "Module Not Found"}
          />
        </div>
        <label className="add-new-user-label">
          Enter the University ID(s) of the User(s)
        </label>
        <div className="select-module-dropdown">
          {/* <CreatableSelect
            styles={customStyles}
            placeholder="Please type here and add them"
            onChange={selectedUsers}
            isMulti
            formatCreateLabel={formatCreateLabel}
            noOptionsMessage={() => null}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
          /> */}
          <Select
            styles={customStyles}
            isMulti
            options={usersFromDB}
            placeholder="Select or Enter User ID"
            noOptionsMessage={() => "No User To Add"}
            onChange={selectedUsers}
            value={newUsers.map((ele) => {
              return { label: ele, value: ele };
            })}
          />
        </div>
        {usersSavedStatus && (
          <div className="error-message">{usersSavedStatus}</div>
        )}
        <div className="add-new-user-buttons">
          <button className="button" onClick={saveUsers}>
            SAVE
          </button>
          <button className="button" onClick={goBackOperation}>
            GO BACK
          </button>
        </div>
      </div>
    </Main>
  );
}

const Main = styled.div`
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
  /* border: 10px solid red; */

  .add-new-user-heading {
    margin-top: 60px;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
  }

  .add-new-user-card {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: flex-start;
  }

  .add-new-user-label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
  }

  .add-new-user-text-field {
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

  .add-new-user-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    /* border: 1px solid red; */
    width: 100%;
    /* margin-bottom: 10px; */
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

  .back-to-login-page {
    margin-top: 5px;
    /* border: 1px solid red; */
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 14px;
    font-weight: 600;
    text-decoration: underline;
  }

  .back-to-login-page:hover {
    cursor: pointer;
  }

  .select-module-dropdown {
    margin-top: 5px;
  }

  .heading {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
    margin: 15px 50px 15px 50px;
    /* border:1px solid red; */
  }

  .module-data-content {
    color: white;
    /* border: 1px solid red; */
    margin-top: 5px;
    margin-left: 50px;
    width: max-content;
    /* border: 1; */
    border-collapse: separate;
    /* border-spacing: 0 25px; */
    border-spacing: 0;
    /* border:1px solid red; */
    margin-bottom: 20px;
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
    /* border:1px solid red; */
  }

  .button:hover {
    cursor: pointer;
  }

  .error-message {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
  }
`;

export default ViewUsersForModules;
