import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import BodyImage from "../../../svgs/body_background.svg";
import { useNavigate, useLocation } from "react-router-dom";

function CheckResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [totalMarksAwarded, setTotalMarksAwarded] = useState("");

  const goBack = () => {
    navigate("../viewAssessments");
  };

  useEffect(() => {
    calculateTotalMarksAwarded();
  }, []);

  const calculateTotalMarksAwarded = () => {
    const marksArray = state.marks_awarded;
    let sum = 0;
    for (let i = 0; i < marksArray.length; i++) {
      if (marksArray[i] === "") continue;
      sum += parseInt(marksArray[i]);
    }
    setTotalMarksAwarded(String(sum));
  };

  return (
    <Result>
      <div className="result-heading">My Result</div>
      <div className="result-content">
        <label className="result-label">Assessment Title</label>
        <input
          className="result-text-field"
          disabled={true}
          value={state.assessment_title}
        />
        <label className="result-label">Result</label>
        <input
          className="result-text-field"
          disabled={true}
          value={totalMarksAwarded + " out of " + state.total_marks}
        />
        <label className="result-label">Feedback</label>
        <textarea disabled={true} rows="5" className="result-text-div">
          {state.feedback ? state.feedback : "No feedback provided."}
        </textarea>
        <button className="result-button" onClick={goBack}>
          Go Back
        </button>
      </div>
    </Result>
  );
}

const Result = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #282c34;
  color: white;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 20px;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 72px;

  .result-heading {
    align-self: center;
    margin-top: 30px;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
  }

  .result-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    /* border: 1px solid red; */
    width: 100%;
    padding-left: 50px;
  }

  .result-label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
    /* border:1px solid red; */
  }

  .result-text-field {
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

  .result-text-field:disabled {
    color: white;
    background-color: rgba(239, 239, 239, 0.3);
  }

  .result-text-div {
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    background-color: rgba(239, 239, 239, 0.3);
    padding: 5px;
    padding-left: 8px;
    border-radius: 5px;
    color: white;
    width: 50%;
    resize: none;
  }

  .result-button {
    margin-top: 50px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 600;
    width: max-content;
    /* height: 45px; */
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
    align-self: center;
  }

  .result-button:hover {
    cursor: pointer;
  }
`;

export default CheckResult;
