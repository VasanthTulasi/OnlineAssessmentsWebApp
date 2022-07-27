import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import AssessmentInstructions from "../AssessmentInstructions";
import Axios from "axios";

function TakeAssessments() {
  const [isModalVisible, setisModalVisible] = useState(true);
  const { state } = useLocation();
  const navigate = useNavigate();
  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/assessments",
    crossDomain: true,
  });
  const [questions, setQuestions] = useState(state.assessment.questions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const submitButton = useRef(null);
  const [selectedOptionIndex,setSelectedOptionIndex] = useState("");

  // useEffect(() => {
  //   axios.post("/assessmentsbyId", { _id: state._id }).then((res) => {
  //     console.log("Returned assessment is:" + JSON.stringify(res.data));
  // const assessment = res.data;
  // setAssessmentTitle(assessment.title);
  // setSelectedDurationMeasure(assessment.duration_measure);
  // setSelectedDurationNumber(assessment.duration_number);
  // setWindowStartTime(assessment.window_start_time);
  // setWindowEndTime(assessment.window_end_time);
  // setModuleCode(assessment.module_code);

  // const finalQuestions = assessment.questions.map((ele, index) => {
  //   return { id: index, ...ele };
  // });
  // setQuestions(finalQuestions);
  // setNextKeyId(finalQuestions.length);

  // if (assessment.duration_measure === "minutes") {
  //   let newNumbers = [];
  //   for (let i = 10; i <= 59; i = i + 10) newNumbers.push(i);
  //   setAssessmentDurationNumberOptions(newNumbers);
  // } else {
  //   let newNumbers = [];
  //   for (let i = 1; i <= 3; i = i + 0.5) newNumbers.push(i);
  //   setAssessmentDurationNumberOptions(newNumbers);
  // }
  //   });
  // }, []);

  const goBack = () => {
    navigate("../viewAssessments");
  };

  const nextQuestion = () => {
    setSelectedOptionIndex("");
    if (questionIndex <= questions.length - 2) {
      setQuestionIndex((prevVal) => prevVal + 1);
      if (questionIndex === questions.length - 2)
        submitButton.current.textContent = "Submit & Finish";
    } else {
      //Submit and Finish functionality
    }
  };

  const optionSelected = (highlightIndex,selVal,quesIndex) => {    
    setSelectedOptionIndex(String(highlightIndex))
    console.log("Answer for question "+quesIndex +" is "+ selVal);
  };

  return (
    <TakeAssess>
      {isModalVisible && (
        <AssessmentInstructions
          assessmentTitle={state.assessment.title}
          proceedWithAssessment={() => setisModalVisible(false)}
          doNotProceed={goBack}
        />
      )}
      {/* {questions[questionIndex].questionText} */}
      <div className="title-timer">
        <div className="title">Java MCQ Test</div>
        <div className="timer">Remaining Time: 34:00</div>
      </div>
      <div className="question">
        <div className="question-number">
          Question {questionIndex + 1} / {questions.length}
        </div>
        <div className="question-text">
          {questions[questionIndex].questionText}
        </div>
        <div className="question-options">
          <div className="question-options-sub">
            <div
              className={selectedOptionIndex == "0" ? "question-option highlight":"question-option"}
              onClick={(event) => optionSelected(0,event.target.textContent,questionIndex)}
            >
              {questions[questionIndex].options[0]}
            </div>
            <div
              className={selectedOptionIndex == "1" ? "question-option highlight":"question-option"}
              onClick={(event) => optionSelected(1,event.target.textContent,questionIndex)}
            >
              {questions[questionIndex].options[1]}
            </div>
          </div>
          <div className="question-options-sub">
            <div
              className={selectedOptionIndex == "2" ? "question-option highlight":"question-option"}
              onClick={(event) => optionSelected(2,event.target.textContent,questionIndex)}
            >
              {questions[questionIndex].options[2]}
            </div>
            <div
              className={selectedOptionIndex == "3" ? "question-option highlight":"question-option"}
              onClick={(event) => optionSelected(3,event.target.textContent,questionIndex)}
            >
              {questions[questionIndex].options[3]}
            </div>
            {/* <div className="question-option"></div> */}
            {/* <div className="question-option"></div> */}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          className="submit-button"
          onClick={nextQuestion}
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
  color: #61dafb;
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
  font-size: 20px;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 72px;

  .title-timer {
    /* border-bottom: 1px solid white; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    /* flex:1; */
  }

  .title {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 19px;
    margin: 20px;
    margin-left:40px;
  }

  .timer {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 19px;
    margin: 20px;
    margin-right:40px;
  }

  .question {
    display: flex;
    /* justify-content: space-between; */
    /* align-items: center; */
    flex-direction: column;
    /* border: 1px solid white; */
    margin: 20px 40px 0 40px;
    /* margin-left: 20px; */

    /* New Lines */
    border-radius: 10px;
    background: #61dafb;
  }

  .question-number {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 15px;
    padding-left: 20px;
    color: black;
    background: #61dafb;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    /* border: 1px solid #61dafb; */
    border-bottom: 1px solid #282c34;
  }

  .question-text {
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 20px;
    /* border: 2px solid #61dafb; */
    border-bottom: 1px solid #282c34;
    border-top: 0;
    color: black;
  }

  .question-options {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 20px;
    color: white;
    border: 2px solid #61dafb;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    display: flex;
    flex-direction: column;
    /* justify-content: space-evenly; */
    align-items: space-evenly;
    flex-wrap: wrap;
    border-top: 0;
  }

  .question-options-sub {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin: 10px 0 10px 0;
  }

  .question-option {
    /* border: 1px solid yellow; */
    width: 40%;
    text-align: center;
    border-radius: 10px;
    padding: 10px;
    border: 1px solid #61dafb;
    color:white;
    border:1px solid black;
    background-color: #282c34;
  }
  
  .highlight{
    color:#282c34;
    /* font-weight: bold; */
    border:2px solid black;
    background-color: #F5EDF0;
    /* F5EDF0 */
  }


  .question-option:hover {
    cursor: pointer;
    /* color: black; */
    /* background-color: #fffff7; */
    /* border: 1px solid black; */
  }

  .submit-button {
    margin: 50px 20px 0 0;
    border: 1px solid #282c34;
    color: black;
    background-color: #61dafb;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 17px;
    font-weight: 400;
    width: 30%;
    border-radius: 10px;
    padding: 10px 20px 10px 20px;
    /* background-color: #f2cc8f; */
    /* color: #0b1118;  */
  }

  .submit-button:hover {
    cursor: pointer;
  }
`;

export default TakeAssessments;
