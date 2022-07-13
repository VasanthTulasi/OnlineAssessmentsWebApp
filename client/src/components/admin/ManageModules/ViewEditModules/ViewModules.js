import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Axios from "axios";
import ConfirmDeleteModal from "../ConfirmDeletionModal";


function ViewModules() {
  let [modulesArray, setModulesArray] = useState([]);
  const navigate = useNavigate();
  const [isModalVisible, setisModalVisible] = useState(false);
  const [deletionIndex, setDeletionIndex] = useState();

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/modules",
    crossDomain: true,
  });

  const editModule = (event) => {
    const itemIndex = event.currentTarget.id.split("_")[1];
    navigate("../editmodule", {
      state: modulesArray[itemIndex]
    });
  };


  const deleteModule = (event) =>{
    setDeletionIndex(event.currentTarget.id.split("_")[1]);
    setisModalVisible(true);
  }

  const confirmedModuleDeletion = () => {
    setisModalVisible(false);
    const itemIndex = deletionIndex;
    axios.post("/deleteModule",{module_code: modulesArray[itemIndex].module_code}).then((res) => {
      if(res.data.message === "success"){
        alert("Module deleted succesfully!");
        const modModulesArray = modulesArray;
        modModulesArray.splice(itemIndex,1);
        console.log("New Array is "+JSON.stringify(modModulesArray));
        setModulesArray([...modModulesArray]);
      }
      else
        alert("Error: " + res.data.message);
    });
  }

  useEffect(() => {
    axios.get("/listofmodules").then((res) => {
      setModulesArray(res.data);
    });
  }, []);

  return (
    <>
    {isModalVisible && (
      <ConfirmDeleteModal setModalVisibility={()=>setisModalVisible(false)} moduleInfo={modulesArray[deletionIndex].module_code} confirmedDeletion={confirmedModuleDeletion}/>
    )}
    <ViewEditMod>
      <div>View / Edit Modules</div>
      <table className="module-data-content">
        <tbody>
          <tr>
            <td className="module-data start headers-color">S. No</td>
            <td className="module-data headers-color">Module Code</td>
            <td className="module-data headers-color">Module Title</td>
            <td className="module-data headers-color">Year</td>
            <td className="module-data end headers-color">Sem</td>
          </tr>
          {modulesArray.map((ele, index) => {
            return (
              <tr>
                <td className="module-data start">{index+1}</td>
                <td className="module-data mid">{ele.module_code}</td>
                <td className="module-data mid">{ele.module_title}</td>
                <td className="module-data mid">{ele.module_year}</td>
                <td className="module-data end">{ele.module_semester}</td>
                <td>
                  <button
                    id={"editButton_" + index}
                    className="module-data-button"
                    onClick={editModule}
                  >
                    Edit
                  </button>
                  <button
                    id={"deleteButton_" + index}
                    className="module-data-button"
                    onClick={deleteModule}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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

  .module-data-content {
    color: white;
    /* border: 1px solid red; */
    margin-top: 25px;
    width: 80%;
    /* border: 1; */
    border-collapse: separate;
    /* border-spacing: 0 25px; */
    border-spacing: 0;
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

  .module-data-button {
    cursor: pointer;
  }

  .headers-color {
    color: #61dafb;
  }
`;

export default ViewModules;
