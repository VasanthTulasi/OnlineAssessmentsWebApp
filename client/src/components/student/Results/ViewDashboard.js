import React, { PureComponent, useState, useContext } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect } from "react";
import Axios from "axios";
import { LoginContext } from "../../../contexts/LoginContext";
import { useNavigate } from "react-router-dom";

function ViewDashboard() {
  const [assignedCoursesInfo, setAssignedCoursesInfo] = useState([]);
  const [assignedCoursesInfoLoaded, setAssignedCoursesInfoLoaded] =
    useState(false);
  const [overallPercentange, setOverallPercentage] = useState([]);
  const [barData, setBarData] = useState([]);
  const { loggedInUserDetails } = useContext(LoginContext);
  const navigate = useNavigate();
  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/users",
    crossDomain: true,
  });

  const axios2 = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/modules",
    crossDomain: true,
  });

  const axios3 = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/submissions",
    crossDomain: true,
  });

  useEffect(() => {
    axios
      .post("/assignedModuleCodes", { uni_id: loggedInUserDetails.uni_id })
      .then((res) => {
        let moduleCodes = res.data;
        console.log("Module codes: " + moduleCodes);
        getModuleInfo(moduleCodes);
      });
  }, []);

  const getModuleInfo = (moduleCodes) => {
    axios2
      .post("/getModulesInfo", { module_codes: moduleCodes })
      .then((res) => {
        console.log(JSON.stringify(res.data));
        setAssignedCoursesInfo(res.data);
        setAssignedCoursesInfoLoaded(true);
        console.log("vals: " + res.data);
      });
  };

  useEffect(() => {
    calculateOverallPercentages();
  }, [assignedCoursesInfo]);

  const calculateOverallPercentages = () => {
    const moduleCodes = assignedCoursesInfo.map((ele) => ele.module_code);
    axios3
      .post("/getOverallPercentages", {
        module_codes: moduleCodes,
        uni_id: loggedInUserDetails.uni_id,
      })
      .then((res) => {
        // console.log("Final values: " + res.data);
        console.log(res.data);
        saveBarChartData(res.data);
        setOverallPercentage(res.data);
      });
  };

  const saveBarChartData = (data) => {
    let barInfo = [];
    barInfo = assignedCoursesInfo.map((val, ind) => {
      return {
        courseId: val.module_code,
        "Course Progress Percentage":
          data[ind] === null ? "NA" : parseInt(data[ind]),
      };
    });
    setBarData(barInfo);
  };

  const goToResultsPage = (index) => {
    // console.log("Result of: " + index);
    navigate("../viewAssessments", {
      state: {
        module_code: assignedCoursesInfo[index].module_code,
      },
    });
  };

  return (
    <Dashboard>
      <div className="heading">Performance Dashboard</div>
      <div style={{ width: "50%", height: "400px", marginTop: "50px" }}>
        {/*
Title: Generate a chart with recharts library
Author: Recharts
Date: NA
Source: https://recharts.org/en-US/api/ResponsiveContainer
*/}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barData}>
            <XAxis
              dataKey="courseId"
              tick={{
                fill: "white",
                fontSize: 17,
                fontFamily: '"Source Sans Pro", sans-serif',
                fontWeight: 400,
              }}
              tickLine={{ stroke: "white" }}
              stroke="white"
            />
            <YAxis
              domain={[0, 100]}
              tick={{
                fill: "white",
                fontSize: 17,
                fontFamily: '"Source Sans Pro", sans-serif',
                fontWeight: 400,
              }}
              tickLine={{ stroke: "white" }}
              stroke="white"
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                // backgroundColor: "#61dafb",
                backgroundColor: "#f2cc8f",
                color: "#282c34",
                border: "1px solid black",
                // borderRadius: "10px",
                fontSize: 17,
                fontFamily: '"Source Sans Pro", sans-serif',
                fontWeight: 400,
              }}
              itemStyle={{ color: "#282c34" }}
            />
            <Legend />
            <Bar dataKey="Course Progress Percentage" fill="#61dafb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          marginLeft: "10%",
          color: "white",
          fontFamily: '"Source Sans Pro", sans-serif',
          fontWeight: 400,
          fontSize: "18px",
          marginTop: "20px",
        }}
      >
        Performance Overview:
      </div>
      <table className="module-data-content">
        <tbody>
          <tr>
            <td className="module-data start headers-color">S. No</td>
            <td className="module-data headers-color">Module Code</td>
            <td className="module-data headers-color">Module Title</td>
            <td className="module-data headers-color">Overall Percentage</td>
            <td className="module-data end headers-color">Remarks</td>
          </tr>
          {assignedCoursesInfo.map((ele, index) => {
            return (
              <tr>
                <td className="module-data start">{index + 1}</td>
                <td className="module-data mid">{ele.module_code}</td>
                <td className="module-data mid">{ele.module_title}</td>
                <td className="module-data mid">
                  {overallPercentange[index] === null
                    ? "NA"
                    : overallPercentange[index] + "%"}
                </td>
                <td className="module-data end">
                  {overallPercentange[index] === null
                    ? "NA"
                    : overallPercentange[index] > 80
                    ? "Excellent Performance"
                    : overallPercentange[index] > 60
                    ? "Good Performance"
                    : "Needs Improvement"}
                </td>
                <td style={{ paddingLeft: "15px" }}>
                  <button
                    id={"viewSubmissionsButton_" + index}
                    disabled={overallPercentange[index] === null ? true : false}
                    className={
                      overallPercentange[index] === null
                        ? "module-data-button button-disabled"
                        : "module-data-button"
                    }
                    onClick={() => goToResultsPage(index)}
                  >
                    View Details
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
          )} */}
          {assignedCoursesInfoLoaded && assignedCoursesInfo.length === 0 && (
            <tr>
              <td colSpan="6" className="no-user-data">
                No courses or assignments available.
              </td>
            </tr>
          )}

          {/* {moduleCode === "" && (
            <tr>
              <td colSpan="6" className="no-user-data">
                No module selected. Please select a module first to see its
                assessments.
              </td>
            </tr>
          )} */}
        </tbody>
      </table>
    </Dashboard>
  );
}

const Dashboard = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #282c34;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-direction: column;
  overflow-y: auto;

  .heading {
    margin-top: 100px;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
  }

  .module-data-content {
    color: white;
    /* border: 1px solid red; */
    margin-top: 20px;
    width: 80%;
    /* border: 1; */
    border-collapse: separate;
    /* border-spacing: 0 25px; */
    border-spacing: 0;
    /* border:1px solid red; */
    padding-bottom: 40px;
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
    /* margin-left: 15px; */
    /* margin-right:   15px; */
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 600;
    /* width: max-content; */
    width: 100%;
    /* height: 45px; */
    /* letter-spacing: 1px; */
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
  }
  .headers-color {
    color: #61dafb;
  }

  .module-data-button:hover {
    cursor: pointer;
  }

  .button-disabled {
    background-color: gray;
  }
  .button-disabled:hover {
    cursor: default;
  }
`;

export default ViewDashboard;
