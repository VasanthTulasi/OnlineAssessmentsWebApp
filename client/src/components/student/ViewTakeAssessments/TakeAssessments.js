import React, { useState, useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import AssessmentInstructionsModal from "../AssessmentInstructionsModal";
import AssessmentEndedModal from "../AssessmentEndedModal";
import AssessmentTimeElapsedModal from "../AssessmentTimeElapsedModal";
import Axios from "axios";
import MCQTemplate from "../AnswerTemplates/MCQTemplate";
import FIBTemplate from "../AnswerTemplates/FIBTemplate";
import EssayTemplate from "../AnswerTemplates/EssayTemplate";
import CodingTemplate from "../AnswerTemplates/CodingTemplate";
import { LoginContext } from "../../../contexts/LoginContext";
import { AssessmentContext } from "../../../contexts/AssessmentContext";

function TakeAssessments() {
  const { loggedInUserDetails } = useContext(LoginContext);
  const { setNavLinksStyle } = useContext(AssessmentContext);

  const [isInstuctionsModalVisible, setIsInstuctionsModalVisible] =
    useState(true);
  const [isAssessmentEndedModalVisible, setIsAssessmentEndedModalVisible] =
    useState(false);
  const [
    isAssessmentTimeElapsedModalVisible,
    setIsAssessmentTimeElapsedModalVisible,
  ] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
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
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageWithOptions, setErrorMessageWithOptions] = useState("");
  const submitButton = useRef(null);
  let countdownTimer;

  const goBack = () => {
    setNavLinksStyle("menu");
    navigate("../viewAssessments");
  };

  const validateAnswer = (questionIndex) => {
    if (
      questions[questionIndex].questionType === "mcq" &&
      answers[questionIndex] === ""
    ) {
      setErrorMessage("Please select an option before proceeding further!");
      return false;
    } else if (questions[questionIndex].questionType === "fib") {
      let blanks = [];
      for (let i = 0; i < answers[questionIndex].length; i++) {
        if (answers[questionIndex][i] === "") {
          blanks.push(i + 1);
        }
      }
      if (blanks.length !== 0) {
        setErrorMessageWithOptions(
          "Are you sure you want to continue with empty values for the following blank(s): " +
            blanks
        );
        return false;
      }
    } else if (
      questions[questionIndex].questionType === "essay" &&
      answers[questionIndex] === ""
    ) {
      setErrorMessageWithOptions("Are you sure you want to continue with an empty response for this question.");
      return false;
    } else if (questions[questionIndex].questionType === "coding") {
      if (answers[questionIndex][1] === "") {
        setErrorMessageWithOptions("Are you sure you want to continue with an empty response for this question.");
        return false;
      } else {
        if (answers[questionIndex][0] === "") {
          setErrorMessage("Please select the programming language before proceedind further!");
          return false;
        }
      }
    }
    return true;
  };

  const saveAndNext = () => {
    if (!validateAnswer(questionIndex)) {
      return;
    }
    saveAnswerInDB();
  };

  const saveAnswerInDB = () => {
    axios
      .post("/saveAnswers", {
        assessment_id: state.assessment._id,
        student_uni_id: loggedInUserDetails.uni_id,
        index: questionIndex,
        answer: answers[questionIndex],
      })
      .then(() => {
        if (questionIndex < questions.length - 1)
          setQuestionIndex((prevVal) => prevVal + 1);
        else {
          setIsAssessmentEndedModalVisible(true);
          updateAttemptsLeftToZero();
          setNavLinksStyle("menu");
        }
      });
  };

  const updateLastAttemptedQuestionInDb = (quesIndex) => {
    console.log("Updated last question: " + quesIndex);
    axios.post("/updateLastAttemptedQuestion", {
      assessment_id: state.assessment._id,
      student_uni_id: loggedInUserDetails.uni_id,
      last_attempted_question: quesIndex,
    });
  };

  useEffect(() => {
    return () => {
      clearInterval(countdownTimer);
      setNavLinksStyle("menu");
    };
  }, []);

  useEffect(() => {
    console.log("Question Index: " + questionIndex);
    setErrorMessage("");
    setErrorMessageWithOptions("");
    if (questionIndex < questions.length) {
      updateLastAttemptedQuestionInDb(questionIndex);
      if (questionIndex === questions.length - 1)
        submitButton.current.textContent = "Submit & Finish";
    }

    if (questions[questionIndex].questionType === "essay") {
      answers[questionIndex] = localStorage.getItem(
        state.assessment._id + "_answer_" + String(questionIndex)
      );
    }
  }, [questionIndex]);

  const mcqOptionClicked = (quesIndex, selVal) => {
    let modArr = [...answers];
    modArr[quesIndex] = selVal;
    setAnswers(modArr);
    setErrorMessage("");
  };

  const saveFIBAnswers = (quesIndex, answerValue, changedIndex = null) => {
    setErrorMessageWithOptions("");
    if (changedIndex != null) {
      console.log("modified array");
      let modArr = [...answers];
      modArr[quesIndex][changedIndex] = answerValue;
      setAnswers(modArr);
    } else {
      console.log("Empty array set");
      let modArr = [...answers];
      modArr[quesIndex] = answerValue;
      setAnswers(modArr);
    }
  };

  const saveEssayAnswer = (quesIndex, answer) => {
    let modArr = [...answers];
    modArr[quesIndex] = answer;
    setAnswers(modArr);
  };

  const saveInitialCodingArray = (quesIndex, initArray) => {
    let modArr = [...answers];
    modArr[quesIndex] = initArray;
    setAnswers(modArr);
  };

  const saveCodingLanguage = (quesIndex, selectedCodingLanguage) => {
    let modArr = [...answers];
    modArr[quesIndex][0] = selectedCodingLanguage;
    setAnswers(modArr);
  };

  const saveCodingAnswer = (quesIndex, answer) => {
    let modArr = [...answers];
    modArr[quesIndex][1] = answer;
    setAnswers(modArr);
  };

  const proceedWithAssessment = () => {
    let durationInMilliSec = calculateAssesmentDuration(
      state.assessment.duration_number,
      state.assessment.duration_measure
    );

    if (state.submissionData == "") {
      axios
        .post("/createNewSubmission", {
          assessment_id: state.assessment._id,
          student_uni_id: loggedInUserDetails.uni_id,
          session_details: {
            attempts_left: 2,
            time_left: durationInMilliSec,
            last_attempted_question: 0,
          },
          numberOfQuestions: questions.length,
        })
        .then((res) => {
          console.log(res.data.message);
          if (res.data.message === "success") {
            setIsInstuctionsModalVisible(false);
            setNavLinksStyle("menu disabled-menu");
            startCountDownTimer(durationInMilliSec);
          } else alert("Error! Please try again later.");
        });
    } else {
      axios
        .post("/updateAttemptsLeft", {
          assessment_id: state.assessment._id,
          student_uni_id: loggedInUserDetails.uni_id,
          attempts_left: state.submissionData.session_details.attempts_left - 1,
        })
        .then((res) => {
          if (res.data.message === "success") {
            const lastAttemptedQuestion =
              state.submissionData.session_details.last_attempted_question;
            setQuestionIndex(lastAttemptedQuestion);
            if (lastAttemptedQuestion === questions.length - 1)
              submitButton.current.textContent = "Submit & Finish";
            setNavLinksStyle("menu disabled-menu");
            setIsInstuctionsModalVisible(false);
            startCountDownTimer(state.submissionData.session_details.time_left);
          } else alert("Error! Please try again later.");
        });
    }
  };

  const calculateAssesmentDuration = (durNumber, durMeasure) => {
    let durInMilliSec;
    if (durMeasure == "hours") durInMilliSec = durNumber * 60 * 60 * 1000;
    else durInMilliSec = durNumber * 60 * 1000;

    return durInMilliSec;
  };

  const startCountDownTimer = (durInMilliSec) => {
    // durInMilliSec = 10000;
    let time = getTimeLeft(durInMilliSec);
    setTimeLeft(time);
    let timeChangedCounter = 0;

    countdownTimer = setInterval(() => {
      console.log("running");
      durInMilliSec -= 1000;
      time = getTimeLeft(durInMilliSec);
      setTimeLeft(time);
      timeChangedCounter++;
      if (timeChangedCounter == 5) {
        // updateTimeLeftInDb(durInMilliSec);
        timeChangedCounter = 0;
      }
      if (durInMilliSec === 0) {
        clearInterval(countdownTimer);
        setIsAssessmentTimeElapsedModalVisible(true);
        setNavLinksStyle("menu");
        updateAttemptsLeftToZero();
      }
    }, 1000);
  };

  const updateAttemptsLeftToZero = () => {
    axios.post("/updateAttemptsLeft", {
      assessment_id: state.assessment._id,
      student_uni_id: loggedInUserDetails.uni_id,
      attempts_left: 0,
    });
  };

  const getTimeLeft = (durInMilliSec) => {
    let hours, minutes, seconds;
    hours = Math.floor(durInMilliSec / (1000 * 60 * 60));
    minutes = Math.floor((durInMilliSec % (1000 * 60 * 60)) / (60 * 1000));
    seconds = Math.floor(
      ((durInMilliSec % (1000 * 60 * 60)) % (60 * 1000)) / 1000
    );

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    return hours + ":" + minutes + ":" + seconds;
  };

  const updateTimeLeftInDb = (durInMilliSec) => {
    axios.post("/updateTimeLeft", {
      assessment_id: state.assessment._id,
      student_uni_id: loggedInUserDetails.uni_id,
      time_left: durInMilliSec,
    });
  };

  const proceedToSave = () => {
    setErrorMessageWithOptions("");
    saveAnswerInDB();
  };

  const doNotSave = () => {
    setErrorMessageWithOptions("");
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
      {isAssessmentTimeElapsedModalVisible && (
        <AssessmentTimeElapsedModal
          okayClicked={() => {
            setIsAssessmentTimeElapsedModalVisible(false);
            navigate("../viewAssessments");
          }}
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
        <div className="timer">Time Left: {timeLeft}</div>
      </div>
      {questions[questionIndex].questionType === "mcq" && (
        <MCQTemplate
          questionIndex={questionIndex}
          question={questions[questionIndex]}
          mcqOptionClicked={mcqOptionClicked}
          totalQuestions={questions.length}
        />
      )}
      {questions[questionIndex].questionType === "fib" && (
        <FIBTemplate
          questionIndex={questionIndex}
          question={questions[questionIndex]}
          totalQuestions={questions.length}
          saveFIBAnswers={saveFIBAnswers}
        />
      )}
      {questions[questionIndex].questionType === "essay" && (
        <EssayTemplate
          questionIndex={questionIndex}
          question={questions[questionIndex]}
          totalQuestions={questions.length}
          saveEssayAnswer={saveEssayAnswer}
          assessment_id={state.assessment._id}
        />
      )}
      {questions[questionIndex].questionType === "coding" && (
        <CodingTemplate
          questionIndex={questionIndex}
          question={questions[questionIndex]}
          totalQuestions={questions.length}
          assessment_id={state.assessment._id}
          saveCodingAnswer={saveCodingAnswer}
          saveCodingLanguage={saveCodingLanguage}
          saveInitialCodingArray={saveInitialCodingArray}
        />
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {errorMessageWithOptions && (
        <div className="error-message-options">
          <div className="error-message-text">{errorMessageWithOptions}</div>
          <div>
            <button className="error-option-button" onClick={proceedToSave}>
              Yes
            </button>
            <button className="error-option-button" onClick={doNotSave}>
              No
            </button>
          </div>
        </div>
      )}
      {!errorMessageWithOptions && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="submit-button"
            onClick={saveAndNext}
            ref={submitButton}
          >
            {"Save & Next"}
          </button>
        </div>
      )}
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

  .error-message-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid red;
    border-radius: 10px;
    padding: 15px;
    margin: 40px;
  }

  .error-message{
    color: red;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 19px;
    text-align: center;
    border: 1px solid red;
    border-radius: 10px;
    padding: 15px;
    margin-top: 40px;
    margin-left: 40px;
    margin-right: 40px;
  }

  .error-message-text {
    color: red;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 19px;
    text-align: center;
  }

  .error-option-button {
    margin-top: 20px;
    margin-left: 50px;
    border: 1px solid red;
    color: red;
    background-color: #282c34;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 400;
    width: max-content;
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
  }

  .error-option-button:hover{
    cursor: pointer;
    color: white;
    border: 1px solid white;
  }

`;

export default TakeAssessments;
