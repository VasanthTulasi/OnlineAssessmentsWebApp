import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import Axios from "axios";
import ConfirmDeleteModal from "../ConfirmDeletionModal";
import SingleSelect from "react-select";
import { LoginContext } from "../../../contexts/LoginContext";
import { useNavigate } from "react-router-dom";

function ViewSubmissions() {
  let [assessmentsArray, setAssessmentsArray] = useState([]);
  let [assessmentsLoaded, setAssessmentsLoaded] = useState(false);
  const navigate = useNavigate();
  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/users",
    crossDomain: true,
  });

  const axios2 = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/assessments",
    crossDomain: true,
  });

  const viewSubmissions = (event) => {
    const itemIndex = event.currentTarget.id.split("_")[1];
    navigate("../viewSubmissions", {
      state: { _id: assessmentsArray[itemIndex]._id },
    });
  };

//   useEffect(() => {
//     axios
//       .post("/assignedModuleCodes", { uni_id: loggedInUserDetails.uni_id })
//       .then((res) => {
//         let moduleCodes = res.data;
//         moduleCodes = moduleCodes.map((ele) => {
//           return { value: ele, label: ele };
//         });
//         setModuleCodesFromDB(moduleCodes);
//       });
//   }, []);

//   useEffect(() => {
//     setAssessmentsLoaded(false);
//     setAssessmentsArray([]);
//     axios2.post("/assessmentsForModule", { moduleCode }).then((res) => {
//       const assessments = res.data;
//       if (assessments.length === 0) {
//         setAssessmentsLoaded(true);
//       } else {
//         setAssessmentsLoaded(true);
//         setAssessmentsArray(assessments);
//       }
//     });
//   }, [moduleCode]);

//   const customStyles = {
//     valueContainer: (provided) => ({
//       ...provided,
//       width: "400px",
//       paddingLeft: "10px",
//       color: "black",
//       font: "17px",
//       fontFamily: '"Source Sans Pro", sans-serif',
//       fontSize: "17px",
//       fontWeight: 400,
//       color: "#282c34",
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       color: "black",
//       font: "17px",
//       fontFamily: '"Source Sans Pro", sans-serif',
//       fontSize: "17px",
//       fontWeight: 400,
//       color: "#282c34",
//       backgroundColor: state.isSelected ? "#61dafb" : "white",
//       "&:hover": {
//         backgroundColor: "rgba(189,197,209,.3)",
//       },
//     }),
//     placeholder: (provided) => ({
//       ...provided,
//       fontSize: "17px",
//     }),
//   };

 
  return (
    <>
      <ViewSubs>
        <div className="heading">Submissions for the Assesment</div>
        <div className="whole-content">
          <div className="heading" style={{ fontSize: "17px" }}>
            Submissions for the Assessment:
          </div>
          <table className="module-data-content">
            <tbody>
              <tr>
                <td className="module-data start headers-color">S. No</td>
                <td className="module-data headers-color">Student First Name</td>
                <td className="module-data headers-color">
                  Student Last Name
                </td>
                <td className="module-data headers-color">
                  Student University ID
                </td>
                <td className="module-data end headers-color">
                  Evaluation Status
                </td>
              </tr>
              {assessmentsArray.map((ele, index) => {
                return (
                  <tr>
                    <td className="module-data start">{index + 1}</td>
                    <td className="module-data mid">{ele.title}</td>
                    <td className="module-data mid">
                      {new Date(ele.window_start_time).toString().slice(0, 21)}
                    </td>
                    <td className="module-data mid">
                      {new Date(ele.window_end_time).toString().slice(0, 21)}
                    </td>
                    <td className="module-data end">
                      {new Date() > new Date(ele.window_end_time)
                        ? "Completed"
                        : new Date() > new Date(ele.window_start_time)
                        ? "Ongoing"
                        : "Yet To Start"}
                    </td>
                    <td>
                      <button
                        id={"viewSubmissionsButton_" + index}
                        onClick={viewSubmissions}
                        disabled={
                          new Date() < new Date(ele.window_start_time)
                            ? true
                            : false
                        }
                        className={
                          new Date() < new Date(ele.window_start_time)
                            ? "module-data-button button-disabled"
                            : "module-data-button"
                        }
                      >
                        Evaluate
                      </button>
                      <button
                        id={"deleteButton_" + index}
                        // onClick={deleteAssessment}
                        disabled={
                          new Date() > new Date(ele.window_start_time)
                            ? true
                            : false
                        }
                        className={
                          new Date() > new Date(ele.window_start_time)
                            ? "module-data-button button-disabled"
                            : "module-data-button"
                        }
                      >
                        View Result
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* {moduleCode !== "" && !assessmentsLoaded && (
                <tr>
                  <td colSpan="6" className="no-user-data">
                    Loading Assesments for the Selected Module...
                  </td>
                </tr>
              )}
              {moduleCode !== "" &&
                assessmentsLoaded &&
                assessmentsArray.length === 0 && (
                  <tr>
                    <td colSpan="6" className="no-user-data">
                      No assessments found for this module.
                    </td>
                  </tr>
                )}

              {moduleCode === "" && (
                <tr>
                  <td colSpan="6" className="no-user-data">
                    No module selected. Please select a module first to see its
                    assessments.
                  </td>
                </tr>
              )} */}
            </tbody>
          </table>
        </div>
      </ViewSubs>
    </>
  );
}

const ViewSubs = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #282c34;
  color: #61dafb;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 20px;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 72px;

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

  .button-disabled {
    background-color: gray;
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

export default ViewSubmissions;
