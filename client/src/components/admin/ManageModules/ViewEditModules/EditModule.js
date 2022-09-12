import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";

function EditModule() {
  const { state } = useLocation();
  const [moduleCode, setModuleCode] = useState(state.module_code);
  const [moduleTitle, setModuleTitle] = useState(state.module_title);
  const [moduleStartYear, setModuleStartYear] = useState(
    state.module_year.substring(0, 4)
  );
  const [moduleEndYear, setModuleEndYear] = useState(
    "20" + state.module_year.substring(5, 7)
  );
  const [moduleSemesterNumber, setModuleSemesterNumber] = useState(
    state.module_semester.substring(4, 5)
  );
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  /*
Title: Create axios instance with 'withCredentials' value as "true"
Author: Saurav Gami
Date: 16-Aug-2022
Source: https://stackoverflow.com/questions/43002444/make-axios-send-cookies-in-its-requests-automatically
Details: This piece of code is used in multiple files.
*/
  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/modules",
    crossDomain: true,
  });

  const saveNewModule = () => {
    let errorMessageString = "";
    if (
      moduleCode === "" ||
      moduleTitle === "" ||
      moduleStartYear === "" ||
      moduleEndYear === "" ||
      moduleSemesterNumber === ""
    ) {
      // alert("Fields cannot be empty. All the fields must be filled.");
      errorMessageString +=
        "Fields cannot be empty. All the fields must be filled.\n\n";
    }
    
    if (moduleCode.length !== 6 || moduleCode.substring(0, 2) !== "CO") {
      // alert("Invalid Module Code Entered.");
      errorMessageString +=
        "Invalid Module Code Entered. Module code should start with 'CO', followed by 4 digits. \n\n";
    }
    console.log(isNaN(moduleStartYear));
    if (isNaN(moduleStartYear) || isNaN(moduleEndYear)) {
      // alert("Module Year must be a numeric value.");
      errorMessageString += "Module Year must be a numeric value.\n\n";
    }

    if (moduleStartYear > 2022) {
      // alert("Semester Number must be a numeric value.");
      errorMessageString += "Module start year must be less than 2023.\n\n";
    }

    if (moduleEndYear < moduleStartYear) {
      // alert("Semester Number must be a numeric value.");
      errorMessageString +=
        "Module end year cannot be earlier than module start year.\n\n";
    }

    if (isNaN(moduleSemesterNumber)) {
      // alert("Semester Number must be a numeric value.");
      errorMessageString += "Semester Number must be a numeric value.\n\n";
    }

    if (moduleSemesterNumber < 1 || moduleSemesterNumber > 8) {
      // alert("Semester Number must be a numeric value.");
      errorMessageString += "Semester Number must be between 1 and 8.\n\n";
    }

    if (errorMessageString !== "") {
      setMessage("Error(s):\n\n" + errorMessageString);
      return;
    } else {
      setMessage("");
    }

    const moduleYear = moduleStartYear + "-" + moduleEndYear.substring(2, 4);
    const moduleSem = "SEM " + moduleSemesterNumber;
    axios
      .post("/editModule", {
        moduleCode,
        moduleTitle,
        moduleYear,
        moduleSem,
      })
      .then((res) => {
        if (res.data.message === "success") {
          setMessage("Module Edited successfully!");
          // saveButton.current.disabled = true;
          // saveButton.current.style.backgroundColor = "gray";
          // navigate("../viewmodules");
        } else setMessage("Server Error! Please try again later");
      });
  };

  const goBackOperation = () => {
    navigate("../viewmodules");
  };

  return (
    <EditMod>
      <div className="add-new-module-heading">Edit Module</div>
      <div className="add-new-module-card">
        <label className="add-new-module-label">Enter Module Code</label>
        <input
          className="add-new-module-text-field"
          placeholder="Module Code"
          onChange={(event) => setModuleCode(event.target.value)}
          value={moduleCode}
          disabled
        />
        <label className="add-new-module-label">Enter Module Title</label>
        <input
          className="add-new-module-text-field"
          placeholder="Module Title"
          onChange={(event) => setModuleTitle(event.target.value)}
          value={moduleTitle}
        />
        <label className="add-new-module-label">Enter Start Year</label>
        <input
          className="add-new-module-text-field"
          placeholder="Enter Start Year"
          onChange={(event) => setModuleStartYear(event.target.value)}
          value={moduleStartYear}
        />
        <label className="add-new-module-label">Enter End Year</label>
        <input
          className="add-new-module-text-field"
          placeholder="Enter End Year"
          onChange={(event) => setModuleEndYear(event.target.value)}
          value={moduleEndYear}
        />
        <label className="add-new-module-label">Enter Semester Number</label>
        <input
          className="add-new-module-text-field"
          placeholder="Semester Number"
          onChange={(event) => setModuleSemesterNumber(event.target.value)}
          value={moduleSemesterNumber}
        />
        {message && <div className="error-message">{message}</div>}
        <div className="add-new-module-buttons">
          <button
            // ref={saveButton}
            className="button"
            onClick={saveNewModule}
          >
            SAVE
          </button>
          <button className="button" onClick={goBackOperation}>
            GO BACK
          </button>
        </div>
      </div>
    </EditMod>
  );
}

const EditMod = styled.div`
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

  .add-new-module-heading {
    margin-top: 30px;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
  }

  .add-new-module-card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex: 7;
  }

  .add-new-module-label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
  }

  .add-new-module-text-field {
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

  .add-new-module-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    /* border: 1px solid red; */
    width: 100%;
    margin-bottom: 10px;
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
  .error-message {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
    border: 1px solid white;
    border-radius: 8px;
    width: 100%;
    padding: 10px;
    white-space: pre-line;
  }
`;

export default EditModule;
