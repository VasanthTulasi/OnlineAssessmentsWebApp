import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "axios";
import ConfirmDeleteModal from "./ConfirmDeletionModal";
import SingleSelect from "react-select";

function ViewUsersForModules() {
  let [moduleUsersArray, setModuleUsersArray] = useState([]);
  let [moduleCode, setModuleCode] = useState("");
  let [usersLoaded, setUsersLoaded] = useState(false);
  const [isModalVisible, setisModalVisible] = useState(false);
  const [deletionIndex, setDeletionIndex] = useState();
  let [moduleCodesFromDB, setModuleCodesFromDB] = useState([]);

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

  const deleteUser = (event) => {
    setDeletionIndex(event.currentTarget.id.split("_")[1]);
    setisModalVisible(true);
  };

  const selectedModule = (selOption) => {
    setModuleCode(selOption.value);
    setUsersLoaded(false);
    setModuleUsersArray([]);
  };

  useEffect(() => {
    axios2.post("/usersForModule", { moduleCode }).then((res) => {
      const users = res.data;
      if (users.length === 0) {
        setUsersLoaded(true);
      } else {
        setUsersLoaded(true);
        setModuleUsersArray(users);
      }
    });
  }, [moduleCode]);

  useEffect(() => {
    axios.get("/moduleCodes").then((res) => {
      let moduleCodes = res.data;
      moduleCodes = moduleCodes.map((ele) => {
        return { value: ele, label: ele };
      });
      setModuleCodesFromDB(moduleCodes);
    });
  }, []);

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
  };

  const confirmedUserDeletion = () => {
    setisModalVisible(false);
    const itemIndex = deletionIndex;
    axios
      .post("/deleteUserFromModule", {
        uni_id: moduleUsersArray[itemIndex].uni_id,
        module_code: moduleCode 
      })
      .then((res) => {
        if (res.data.message === "success") {
          alert("User deleted succesfully!");
          const modUsersArray = moduleUsersArray;
          modUsersArray.splice(itemIndex, 1);
          setModuleUsersArray([...modUsersArray]);
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
        <div className="heading">View Users For Modules</div>
        <div class="whole-content">
          <label className="select-module-label">Select Module Code</label>
          <div className="select-module-dropdown">
            <SingleSelect
              options={moduleCodesFromDB}
              styles={customStyles}
              placeholder="Select or Enter Module Code"
              onChange={selectedModule}
            />
          </div>
          <div className="heading" style={{ fontSize: "17px" }}>
            Users for the selected module:
          </div>
          <table className="module-data-content">
            <tbody>
              <tr>
                <td className="module-data start headers-color">S. No</td>
                <td className="module-data headers-color">First Name</td>
                <td className="module-data headers-color">Last Name</td>
                <td className="module-data headers-color">Role</td>
                <td className="module-data headers-color">University ID</td>
                <td className="module-data end headers-color">Email</td>
              </tr>
              {moduleUsersArray.map((ele, index) => {
                return (
                  <tr>
                    <td className="module-data start">{index + 1}</td>
                    <td className="module-data mid">{ele.first_name}</td>
                    <td className="module-data mid">{ele.last_name}</td>
                    <td className="module-data mid">{ele.role}</td>
                    <td className="module-data mid">{ele.uni_id}</td>
                    <td className="module-data end">{ele.email}</td>
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

              {moduleCode !== "" && !usersLoaded && (
                <tr>
                  <td colSpan="6" className="no-user-data">
                    Loading Users for the Selected Module...
                  </td>
                </tr>
              )}

              {moduleCode !== "" &&
                usersLoaded &&
                moduleUsersArray.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-user-data">
                      No users found for this module.
                    </td>
                  </tr>
                )}

              {moduleCode === "" && (
                <tr>
                  <td colSpan="6" className="no-user-data">
                    No module selected. Please select a module first to see its
                    users.
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

  .select-module-dropdown {
    margin-top: 5px;
  }

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
    width: 80%;
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
`;

export default ViewUsersForModules;
