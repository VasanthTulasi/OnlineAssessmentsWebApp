import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import SingleSelect from "react-select";
import Axios from "axios";
import BodyImage from "../../../svgs/body_background.svg";
import MCQTemplate from "../QuestionTemplates/MCQTemplate";
import FIBTemplate from "../QuestionTemplates/FIBTemplate";
import EssayTemplate from "../QuestionTemplates/EssayTemplate";
import CodingTemplate from "../QuestionTemplates/CodingTemplate";
import QuestionTypeDropdown from "../QuestionTypeDropdown";
import { LoginContext } from "../../../contexts/LoginContext";
import { useNavigate, useLocation } from "react-router-dom";

function EvaluateSubmission() {
  const navigate = useNavigate();
  const { state } = useLocation();
  // const { loggedInUserDetails } = useContext(LoginContext);
  // const [moduleCodesFromDB, setModuleCodesFromDB] = useState([]);
  // const [moduleCode, setModuleCode] = useState("");
  const [questions, setQuestions] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [totalMarks, setTotalMarks] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [marksAwarded, setMarksAwarded] = useState([]);
  const [totalMarksAwarded, setTotalMarksAwarded] = useState(0);

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/assessments",
    crossDomain: true,
  });

  const axios2 = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/submissions",
    crossDomain: true,
  });

  useEffect(() => {
    axios.post("/assessmentsbyId", { _id: state.assessment_id }).then((res) => {
      const assessment = res.data;
      setTotalMarks(assessment.total_marks);
      setQuestions(assessment.questions);
    });

    axios2
      .post("/getStudentAnswersAndMarks", {
        assessment_id: state.assessment_id,
        student_uni_id: state.student_uni_id,
      })
      .then((res) => {
        const studentAnswers = res.data;
        setStudentAnswers(studentAnswers.answers);
        if (studentAnswers.marks_awarded.length !== 0)
          setMarksAwarded(studentAnswers.marks_awarded);
        else setMarksAwarded(Array(studentAnswers.answers.length).fill(""));

        setFeedback(studentAnswers.feedback);
      });
  }, []);

  useEffect(() => {
    calculateTotalMarks();
  }, [marksAwarded]);

  const save = () => {
    if (validateQuestions()) {
      // console.log("All ok.. can save to server");
      console.log(marksAwarded);
      console.log(feedback);

      axios2
        .post("/saveMarksAwarded", {
          assessment_id: state.assessment_id,
          student_uni_id: state.student_uni_id,
          marks_awarded: marksAwarded,
          feedback: feedback,
          marks_released: false,
          manually_evaluated: true
        })
        .then((res) => {
          if (res.data.message === "success") {
            alert("Marks saved successfully!");
            navigate("../viewSubmissions", {
              state: {
                _id: state.assessment_id,
                total_marks: totalMarks,
              },
            });
          }
        });
    }
  };

  const validateQuestions = () => {
    for (let i = 0; i < marksAwarded.length; i++) {
      if (marksAwarded[i] == "") {
        console.log(
          "Error in question number " +
            (i + 1) +
            ". Marks awarded cannot be empty."
        );
        return false;
      }
    }

    for (let i = 0; i < marksAwarded.length; i++) {
      if (marksAwarded[i] > questions[i].questionMarks) {
        console.log(
          "Error in question number " +
            (i + 1) +
            ". Marks awarded cannot exceed the maximum marks for this question."
        );
        return false;
      }
    }

    // let marksSum = 0;
    // for (let i = 0; i < marksAwarded.length; i++) {
    //   marksSum += parseInt(marksAwarded[i]);
    // }

    // if (totalMarksAwarded > totalMarks) {
    //   console.log(
    //     "Sum of the individual marks cannot exceed the maximum marks for this assessment."
    //   );
    //   return false;
    // }

    return true;
  };

  const goBack = () => {
    navigate("../viewSubmissions", {
      state: {
        _id: state.assessment_id,
        total_marks: totalMarks,
      },
    });
  };

  const validateEntry = (event) => {
    if (
      event.which === 8 ||
      event.which === 13 ||
      event.which === 46 ||
      event.which === 37 ||
      event.which === 39
    )
      return;
    if (event.which >= 48 && event.which <= 57) return;
    if (event.which >= 96 && event.which <= 105) return;

    alert("Only numeric values are allowed in this field");
    event.preventDefault();
  };

  const calculateTotalMarks = () => {
    let marksSum = 0;
    for (let i = 0; i < marksAwarded.length; i++) {
      if (marksAwarded[i] === "") continue;
      marksSum += parseInt(marksAwarded[i]);
    }
    setTotalMarksAwarded(marksSum);
  };

  // const saveFeedback = (event) =>{

  // }

  //Save Marks
  const saveAwardedMarks = (event) => {
    console.log("triggered");
    const index = event.target.id.split("_")[2];
    let marks = event.target.value;
    // if (marks.trim() === "") {
    //   // console.log("yes");
    //   marks = 0;
    // }
    let modMarksAwardedArr = [...marksAwarded];
    modMarksAwardedArr[index] = marks;
    setMarksAwarded(modMarksAwardedArr);
  };

  return (
    <EvalSubmission>
      <div className="evaluate-heading">Evaluate Submission</div>
      <div className="submission-info">
        <label className="submission-info-label">Student First Name</label>
        <input
          className="submission-text-field"
          defaultValue={state.student_first_name}
          disabled="true"
        />
        <label className="submission-info-label">Student Last Name</label>
        <input
          className="submission-text-field"
          defaultValue={state.student_last_name}
          disabled="true"
        />
        <label className="submission-info-label">Student University ID</label>
        <input
          className="submission-text-field"
          defaultValue={state.student_uni_id}
          disabled="true"
        />
      </div>
      <div className="questions">
        <label className="submission-info-label" style={{ width: "80%" }}>
          Questions to be Evaluated:
        </label>
        {questions.map((ele, index) => {
          return (
            <div key={ele.id} id={ele.id} className="new-question">
              <div className="question-number">{index + 1}</div>
              <div className="question-content">
                <label className="submission-info-label">Question Type</label>
                <QuestionTypeDropdown
                  indexVal={index}
                  changeQuestionType={() => {}}
                  questionType={ele.questionType}
                  isDisabled={true}
                />
                {ele.questionType === "mcq" && (
                  <MCQTemplate
                    indexVal={index}
                    saveMCQQuestion={() => {}}
                    saveMCQQuestionOptions={() => {}}
                    saveMCQCorrectAnswer={() => {}}
                    questionText={ele.questionText}
                    options={ele.options}
                    correctAnswer={ele.correctAnswer}
                    isDisabled={true}
                  />
                )}
                {ele.questionType === "fib" && (
                  <FIBTemplate
                    indexVal={index}
                    saveFIBQuestion={() => {}}
                    saveFIBAnswers={() => {}}
                    questionText={ele.questionText}
                    correctFIBAnswers={ele.correctFIBAnswers}
                    removeFIBAnswer={() => {}}
                    isDisabled={true}
                  />
                )}
                {ele.questionType === "essay" && (
                  <EssayTemplate
                    indexVal={index}
                    saveEssayQuestion={() => {}}
                    questionText={ele.questionText}
                    isDisabled={true}
                  />
                )}
                {ele.questionType === "coding" && (
                  <CodingTemplate
                    indexVal={index}
                    saveCodingQuestion={() => {}}
                    saveCodingLanguage={() => {}}
                    questionText={ele.questionText}
                    codingLanguage={ele.codingLanguage}
                    isDisabled={true}
                  />
                )}
                <div style={{ marginTop: "5px" }}>
                  <label className="submission-info-label">
                    Marks for Correct Answer
                  </label>
                  <br />
                  <input
                    id={"question_marks_" + index}
                    className="submission-text-field"
                    defaultValue={ele.questionMarks}
                    disabled="true"
                  />
                </div>
                <div style={{ marginTop: "5px" }}>
                  <label className="submission-info-label">
                    Student's Answer
                  </label>
                  <br />
                  <div
                    id={"student_answer_" + index}
                    className="student-answer"
                    // defaultValue={ele.questionMarks}
                    disabled="true"
                  >
                    {studentAnswers[index]}
                  </div>
                </div>
                <div style={{ marginTop: "5px" }}>
                  <label className="submission-info-label">Marks Awarded</label>
                  <br />
                  <input
                    id={"marks_awarded_" + index}
                    className="submission-text-field"
                    onChange={saveAwardedMarks}
                    // onKeyDown={validateEntry}
                    value={marksAwarded[index]}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="total-marks-and-feedback">
        <div className="total-marks-awarded">
          <label className="submission-info-label">Total Marks Awarded</label>
          <input
            className="submission-text-field"
            disabled="true"
            value={totalMarksAwarded + " out of " + totalMarks}
          />
        </div>
        <div className="total-marks-awarded">
          <label className="submission-info-label">Feedback for Student</label>
          <textarea
            rows="5"
            className="feedback-text-area"
            onBlur={(event) => setFeedback(event.currentTarget.value)}
            defaultValue={feedback}
          />
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          width: "100%",
          backgroundColor: "#282c34",
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        <button className="new-question-button" onClick={goBack}>
          Go Back
        </button>
        <button className="new-question-button" onClick={save}>
          Save
        </button>
      </div>
    </EvalSubmission>
  );
}

const EvalSubmission = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #282c34;
  /* background-image: url("${BodyImage}");
  background-repeat: repeat;
  background-size: auto; */
  color: white;
  padding-top: 72px;
  /* border: 1px solid red; */
  flex-direction: column;
  margin-top: 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
  /* background-color: #282c34; */

  .evaluate-heading {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 21px;
    /* border: 1px solid red; */
    vertical-align: middle;
    /* text-decoration: underline; */
    /* margin-top: 0px; */
    text-align: center;
  }

  .submission-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    /* width:40%; */
    /* border:1px solid red; */
    /* width: 100%; */
    /* text-align: center; */
    /* display:table; */
    /* margin-left: calc(150% - var(--width)); */
  }

  .submission-info-label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
  }

  .select-module-dropdown {
    /* border:1px solid red; */
    margin-top: 5px;
  }

  .assessment-duration {
    margin-top: 5px;
    width: 100%;
    display: flex;
    flex-direction: row;
    /* border: 1px solid red; */
  }

  .assessment-duration-number {
    height: 35px;
    border-radius: 5px;
    flex: 2;
    margin-right: 5px;
    padding-left: 5px;
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
  }

  .assessment-duration-measure {
    height: 35px;
    border-radius: 5px;
    flex: 8;
    margin-left: 5px;
    padding-left: 5px;
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
  }

  .submission-text-field {
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

  .questions {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    flex-direction: column;
    /* border: 1px solid red; */
    margin-bottom: 0px;
    width: 100%;
    background-color: #282c34;
  }

  .new-question {
    border: 2px solid white;
    border-radius: 10px;
    margin-top: 30px;
    display: flex;
    width: 80%;
    justify-content: space-evenly;
    align-items: center;
    background-color: #282c34;
  }

  .question-number {
    padding: 0px 20px 0px 20px;
    flex: 1;
    text-align: center;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 20px;
    font-weight: 400;
    margin-top: 20px;
  }
  .question-content {
    border-left: 1px solid white;
    padding: 15px 20px 15px 20px;
    /* border: 1px solid green; */
    flex: 12;
    /* text-align: center; */
  }

  .new-question-button {
    margin: 10px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 600;
    width: max-content;
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
    text-align: center;
  }

  .remove-question-button {
    margin-top: 25px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 600;
    width: max-content;
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
    text-align: center;
  }

  .remove-question-button:hover {
    cursor: pointer;
  }

  .new-question-button:hover {
    cursor: pointer;
  }

  input:disabled {
    color: white;
  }

  .student-answer {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    background-color: rgba(239, 239, 239, 0.3);
    margin-top: 5px;
    border-radius: 5px;
    /* width: 400px; */
    /* height: 35px; */
    padding: 5px;
    padding-left: 10px;
  }

  .total-marks-awarded {
    /* border: 1px solid red; */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 80%;
  }

  .total-marks-and-feedback {
    /* border: 1px solid red; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .feedback-text-area {
    width: 400px;
    color: black;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    padding: 5px;
    border-radius: 5px;
    margin-top: 5px;
    margin-bottom: 20px;
    /* border: none; */
    resize: none;
  }
`;

export default EvaluateSubmission;
