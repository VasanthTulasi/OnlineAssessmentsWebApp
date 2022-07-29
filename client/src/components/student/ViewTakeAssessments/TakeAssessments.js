import React, { useState, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import AssessmentInstructionsModal from "../AssessmentInstructionsModal";
import AssessmentEndedModal from "../AssessmentEndedModal";
import Axios from "axios";
import MCQTemplate from "../AnswerTemplates/MCQTemplate";
import { LoginContext } from "../../../contexts/LoginContext";

function TakeAssessments() {
  const { loggedInUserDetails } = useContext(LoginContext);
  const [isInstuctionsModalVisible, setIsInstuctionsModalVisible] =
    useState(true);
  const [isAssessmentEndedModalVisible, setIsAssessmentEndedModalVisible] =
    useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/submissions",
    crossDomain: true,
  });

  const questions = state.assessment.questions;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const submitButton = useRef(null);

  const goBack = () => {
    navigate("../viewAssessments");
  };

  const saveAndNext = () => {
    // if (answers[questionIndex] === "") {
    //   console.log("Cannot move forward without an answer..");
    //   return;
    // }

    //Save
    axios
      .post("/saveAnswers", {
        assessment_id: state.assessment._id,
        student_uni_id: loggedInUserDetails.uni_id,
        index: questionIndex,
        answer: answers[questionIndex],
      })
      .then((res) => {
        //Next
        console.log(res.data.message);
        if (questionIndex < questions.length - 1) {
          setQuestionIndex((prevVal) => prevVal + 1);
          if (questionIndex === questions.length - 2)
            submitButton.current.textContent = "Submit & Finish";
        } else {
          setIsAssessmentEndedModalVisible(true);
        }
      });
  };

  const optionClicked = (quesIndex, selVal) => {
    let answersArr = [...answers];
    answersArr[quesIndex] = selVal;
    setAnswers(answersArr);
  };

  const proceedWithAssessment = () => {
    axios
      .post("/createNewSubmission", {
        assessment_id: state.assessment._id,
        student_uni_id: loggedInUserDetails.uni_id,
        numberOfQuestions: questions.length,
      })
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message === "success" || res.data.message === "already exists") setIsInstuctionsModalVisible(false);
        else alert("Error! Please try again later.");
      });
  };

  return (
    <TakeAssess>
      {isInstuctionsModalVisible && (
        <AssessmentInstructionsModal
          assessmentTitle={state.assessment.title}
          proceedWithAssessment={proceedWithAssessment}
          doNotProceed={goBack}
        />
      )}
      {isAssessmentEndedModalVisible && (
        <AssessmentEndedModal
          okayClicked={() => {
            setIsAssessmentEndedModalVisible(false);
            navigate("../viewAssessments");
          }}
        />
      )}
      {/* {questions[questionIndex].questionText} */}
      <div className="title-timer">
        <div className="title">Java MCQ Test</div>
        <div className="timer">Remaining Time: 34:00</div>
      </div>
      <MCQTemplate
        questionIndex={questionIndex}
        totalQuestions={questions.length}
        question={questions[questionIndex]}
        optionClicked={optionClicked}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className="submit-button"
          onClick={saveAndNext}
          ref={submitButton}
        >
          {"Save & Next"}
        </button>
      </div>
    </TakeAssess>
  );
}

const TakeAssess = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #282c34;
  font-size: 20px;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 72px;

  .title-timer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  }

  .title {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 19px;
    margin: 20px;
    margin-left: 40px;
  }

  .timer {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 19px;
    margin: 20px;
    margin-right: 40px;
  }

  .submit-button {
    margin: 50px 0px 50px 0;
    border: 1px solid #282c34;
    color: black;
    background-color: #61dafb;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 17px;
    font-weight: 400;
    width: 30%;
    border-radius: 10px;
    padding: 10px 20px 10px 20px;
    /* letter-spacing: 1em; */
  }

  .submit-button:hover {
    cursor: pointer;
  }
`;

export default TakeAssessments;
