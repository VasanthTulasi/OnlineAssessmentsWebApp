import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import SingleSelect from "react-select";
import Axios from "axios";
import BodyImage from "../../svgs/body_background.svg";
import MCQTemplate from "./QuestionTemplates/MCQTemplate";
import FIBTemplate from "./QuestionTemplates/FIBTemplate";
import EssayTemplate from "./QuestionTemplates/EssayTemplate";
import CodingTemplate from "./QuestionTemplates/CodingTemplate";
import QuestionTypeDropdown from "./QuestionTypeDropdown";
import { LoginContext } from "../../contexts/LoginContext";

function CreateAssessments() {
  const { loggedInUserDetails } = useContext(LoginContext);
  const [moduleCodesFromDB, setModuleCodesFromDB] = useState([]);
  const [moduleCode, setModuleCode] = useState("");
  const [questions, setQuestions] = useState([]);
  const [nextKeyId, setNextKeyId] = useState(1);
  const [assessmentDurationNumberOptions, setAssessmentDurationNumberOptions] =
    useState([]);
  const [selectedDurationMeasure, setSelectedDurationMeasure] =
    useState("minutes");
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [selectedDurationNumber, setSelectedDurationNumber] = useState(10);
  const [windowStartTime, setWindowStartTime] = useState("");
  const [windowEndTime, setWindowEndTime] = useState("");

  const [showfirstQuestion, setShowFirstQuestion] = useState(true);

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

  //Question Type Method
  const changeQuestionType = (index, val) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionType = val;
    modQuestionArr[index].questionText = "";

    if (val === "mcq") {
      deletePropertiesExcept(
        ["id", "questionType", "questionText", "options", "correctAnswer"],
        modQuestionArr,
        index
      );
      modQuestionArr[index].options = [];
      modQuestionArr[index].correctAnswer = "";
    } else if (val === "fib") {
      deletePropertiesExcept(
        ["id", "questionType", "questionText", "correctFIBAnswers"],
        modQuestionArr,
        index
      );
      modQuestionArr[index].correctFIBAnswers = [];
    } else if (val === "essay") {
      deletePropertiesExcept(
        ["id", "questionType", "questionText"],
        modQuestionArr,
        index
      );
    } else {
      deletePropertiesExcept(
        ["id", "questionType", "questionText", "codingLanguage"],
        modQuestionArr,
        index
      );
      modQuestionArr[index].codingLanguage = "";
    }

    // console.log("Final arr " + JSON.stringify(modQuestionArr[index]));
    setQuestions(modQuestionArr);
  };

  const deletePropertiesExcept = (exceptionVals, modQuestionArr, index) => {
    for (let val in modQuestionArr[index]) {
      if (!exceptionVals.includes(String(val))) {
        // console.log("deleting " + val);
        delete modQuestionArr[index][val];
      }
    }
  };

  //MCQ Methods
  const saveMCQQuestion = (index, question) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionText = question;
    setQuestions(modQuestionArr);
  };

  const saveMCQQuestionOptions = (index, options) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].options = options;
    setQuestions(modQuestionArr);
  };

  const saveMCQCorrectAnswer = (index, correctAnswer) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].correctAnswer = correctAnswer;
    setQuestions(modQuestionArr);
  };

  //Essay Methods
  const saveEssayQuestion = (index, question) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionText = question;
    setQuestions(modQuestionArr);
  };

  //FIB Methods
  const saveFIBQuestion = (index, question) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionText = question;
    setQuestions(modQuestionArr);
  };

  const saveFIBAnswers = (index, answerIndex, correctAnswer) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].correctFIBAnswers[answerIndex] = correctAnswer;
    setQuestions(modQuestionArr);
  };

  const removeFIBAnswer = (index) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].correctFIBAnswers.splice(
      modQuestionArr[index].correctFIBAnswers.length - 1,
      1
    );
    setQuestions(modQuestionArr);
  };

  //Coding Methods
  const saveCodingQuestion = (index, question) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionText = question;
    setQuestions(modQuestionArr);
  };

  const saveCodingLanguage = (index, codingLanguage) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].codingLanguage = codingLanguage;
    setQuestions(modQuestionArr);
  };

  useEffect(() => {
    axios
      .post("/assignedModuleCodes", { uni_id: loggedInUserDetails.uni_id })
      .then((res) => {
        let moduleCodes = res.data;
        moduleCodes = moduleCodes.map((ele) => {
          return { value: ele, label: ele };
        });
        setModuleCodesFromDB(moduleCodes);
      });

    if (selectedDurationMeasure === "minutes") {
      let newNumbers = [];
      for (let i = 10; i <= 59; i = i + 10) newNumbers.push(i);
      setAssessmentDurationNumberOptions(newNumbers);
    } else {
      let newNumbers = [];
      for (let i = 1; i <= 3; i = i + 0.5) newNumbers.push(i);
      setAssessmentDurationNumberOptions(newNumbers);
    }
  }, []);

  const moduleCodeSelected = (selOption) => {
    setModuleCode(selOption.value);
    if (showfirstQuestion) {
      displayFirstQuestion();
      setShowFirstQuestion(false);
    }
  };

  const changeDurationMeasure = (event) => {
    setSelectedDurationMeasure(event.target.value);
    if (event.target.value === "minutes") {
      let newNumbers = [];
      for (let i = 10; i <= 59; i = i + 10) newNumbers.push(i);
      setAssessmentDurationNumberOptions(newNumbers);
    } else {
      let newNumbers = [];
      for (let i = 1; i <= 3; i = i + 0.5) newNumbers.push(i);
      setAssessmentDurationNumberOptions(newNumbers);
    }
  };

  const displayFirstQuestion = () => {
    setQuestions([
      {
        id: 0,
        questionType: "mcq",
        questionText: "",
        options: [],
        correctAnswer: "",
      },
    ]);
  };

  const addNewQuestion = () => {
    setQuestions((prevState) => [
      ...prevState,
      {
        id: nextKeyId,
        questionType: "mcq",
        questionText: "",
        options: [],
        correctAnswer: "",
      },
    ]);
    setNextKeyId((currentId) => currentId + 1);
  };

  const removeQuestion = (event) => {
    const index = event.currentTarget.id.split("_")[2];
    let modQuestionArray = [...questions];
    modQuestionArray.splice(index, 1);
    setQuestions(modQuestionArray);
  };

  const save = () => {
    // console.log("\n" + JSON.stringify(questions));
    // console.log(assessmentTitle);
    // console.log(selectedDurationNumber);
    // console.log(selectedDurationMeasure);
    // console.log(windowStartTime);
    // console.log(windowEndTime);

    if (
      assessmentTitle === "" ||
      windowStartTime === "" ||
      windowEndTime === ""
    ) {
      alert("Fields cannot be empty. All the fields must be filled.");
    } else if (windowStartTime <= getCurrentTime()) {
      alert(
        "Assessment Window Start Time cannot be in the past. Please select a future time."
      );
    } else if (windowEndTime <= windowStartTime) {
      alert(
        "Assessment Window End Time cannot be same or earlier than the Start Time."
      );
    } else if (validateQuestions() === true) {
      let assessment = {
        module_code: moduleCode,
        title: assessmentTitle,
        duration_number: selectedDurationNumber,
        duration_measure: selectedDurationMeasure,
        window_start_time: windowStartTime,
        window_end_time: windowEndTime,
      };
      const questionsWithoutIDs = questions.map((ele) => {
        if (ele.questionType === "mcq")
          return {
            questionType: ele.questionType,
            questionText: ele.questionText,
            options: ele.options,
            correctAnswer: ele.correctAnswer,
          };
        else if (ele.questionType === "fib")
          return {
            questionType: ele.questionType,
            questionText: ele.questionText,
            correctFIBAnswers: ele.correctFIBAnswers,
          };
        else if (ele.questionType === "coding")
          return {
            questionType: ele.questionType,
            questionText: ele.questionText,
            codingLanguage: ele.codingLanguage,
          };
        else
          return {
            questionType: ele.questionType,
            questionText: ele.questionText,
          };
      });
      assessment.questions = questionsWithoutIDs;
      console.log("final object: "+JSON.stringify(assessment));
      axios2
        .post("saveNewAssessment", assessment)
        .then((res) => alert(JSON.stringify(res.data.message)));
    }
  };

  const getCurrentTime = () => new Date().toISOString().slice(0, 16);

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].questionText === "") {
        alert(
          "Error in question number " + (i + 1) + ". Question cannot be empty."
        );
        return false;
      }

      if (questions[i].questionType === "mcq") {
        if (questions[i].options.length < 2) {
          alert(
            "Error in question number " +
              (i + 1) +
              ". There must atleast be two options for the question."
          );
          return false;
        } else if (questions[i].correctAnswer === "") {
          alert(
            "Error in question number " +
              (i + 1) +
              ". The correct answer selected for the question is invalid."
          );
          return false;
        }
      } else if (questions[i].questionType === "fib") {
        
        for(let j=0;j<questions[i].correctFIBAnswers.length;j++){
          if(questions[i].correctFIBAnswers[j].length === 0){
            alert(
              "Error in question number " +
                (i + 1) +
                ". The correct answer for question "+(j+1) + " cannot be empty."
            );
            return false;
          }
        }

        if (questions[i].correctFIBAnswers.length === 0) {
          alert(
            "Error in question number " +
              (i + 1) +
              ". There must at least be one blank AND a valid correct answer."
          );
          return false;
        }

      } else if (questions[i].questionType === "coding") {
        if (questions[i].codingLanguage === "") {
          alert(
            "Error in question number " +
              (i + 1) +
              ". Atleast one programming language must be selected."
          );
          return false;
        }
      }
    }

    return true;
  };

  const customStyles1 = {
    container: (provided) => ({
      ...provided,
      width: "400px",
      height: "35px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      // width: "400px",
      paddingLeft: "10px",
      color: "black",
      font: "17px",
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: "17px",
      fontWeight: 400,
      color: "#282c34",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "black",
      font: "17px",
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: "17px",
      fontWeight: 400,
      color: "#282c34",
      backgroundColor: state.isSelected ? "#61dafb" : "white",
      "&:hover": {
        backgroundColor: "rgba(189,197,209,.3)",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "17px",
    }),
  };

  return (
    <CreateAssessment>
      <div className="pending-registrations-heading">Create an Assessment</div>
      <div className="assessment-info">
        <label className="assessment-info-label">Enter Assessment Title</label>
        <input
          className="assessment-text-field"
          placeholder="Assessment Title"
          onChange={(e) => {
            setAssessmentTitle(e.target.value);
          }}
        />
        <label className="assessment-info-label">
          Select Assessment Duration
        </label>
        <div className="assessment-duration">
          <select
            className="assessment-duration-number"
            onChange={(e) => {
              setSelectedDurationNumber(e.target.value);
            }}
          >
            {assessmentDurationNumberOptions.map((e) => {
              return <option value={e}>{e}</option>;
            })}
          </select>
          <select
            className="assessment-duration-measure"
            onChange={(event) => changeDurationMeasure(event)}
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hour(s)</option>
          </select>
        </div>
        <label className="assessment-info-label">
          Select Assessment Window Start Time
        </label>
        <input
          type="datetime-local"
          min={getCurrentTime}
          className="assessment-text-field"
          placeholder="Assessment Title"
          onChange={(e) => {
            setWindowStartTime(e.target.value);
          }}
        />
        <label className="assessment-info-label">
          Select Assessment Window End Time
        </label>
        <input
          type="datetime-local"
          min={windowStartTime}
          className="assessment-text-field"
          placeholder="Assessment Title"
          onChange={(e) => {
            setWindowEndTime(e.target.value);
          }}
        />
        <label className="assessment-info-label">Select Module Code</label>
        <div className="select-module-dropdown">
          <SingleSelect
            options={moduleCodesFromDB}
            styles={customStyles1}
            placeholder="Select or Search Module Code"
            onChange={moduleCodeSelected}
            noOptionsMessage={() => "This module is not assigned to you"}
          />
        </div>
      </div>

      <div className="questions">
        {moduleCode !== "" && (
          <label className="assessment-info-label" style={{ width: "80%" }}>
            Create Questions
          </label>
        )}
        {moduleCode !== "" &&
          questions.map((ele, index) => {
            return (
              <div key={ele.id} className="new-question">
                <div className="question-number">{index + 1}</div>
                <div className="question-content">
                  <label className="assessment-info-label">
                    Select Question Type
                  </label>
                  <QuestionTypeDropdown
                    indexVal={index}
                    changeQuestionType={changeQuestionType}
                    questionType={ele.questionType}
                  />
                  {ele.questionType === "mcq" && (
                    <MCQTemplate
                      indexVal={index}
                      saveMCQQuestion={saveMCQQuestion}
                      saveMCQQuestionOptions={saveMCQQuestionOptions}
                      saveMCQCorrectAnswer={saveMCQCorrectAnswer}
                      questionText={ele.questionText}
                      options={ele.options}
                      correctAnswer={ele.correctAnswer}
                    />
                  )}
                  {ele.questionType === "fib" && (
                    <FIBTemplate
                      indexVal={index}
                      saveFIBQuestion={saveFIBQuestion}
                      saveFIBAnswers={saveFIBAnswers}
                      questionText={ele.questionText}
                      correctFIBAnswers={ele.correctFIBAnswers}
                      removeFIBAnswer={removeFIBAnswer}
                    />
                  )}
                  {ele.questionType === "essay" && (
                    <EssayTemplate
                      indexVal={index}
                      saveEssayQuestion={saveEssayQuestion}
                      questionText={ele.questionText}
                    />
                  )}
                  {ele.questionType === "coding" && (
                    <CodingTemplate
                      indexVal={index}
                      saveCodingQuestion={saveCodingQuestion}
                      saveCodingLanguage={saveCodingLanguage}
                      questionText={ele.questionText}
                    />
                  )}
                  <button
                    className="remove-question-button"
                    id={"remove_question_" + index}
                    onClick={removeQuestion}
                  >
                    Remove This Question
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      {moduleCode !== "" && (
        <div style={{ textAlign: "center" }}>
          <button className="new-question-button" onClick={addNewQuestion}>
            Add New Question
          </button>
          <button className="new-question-button" onClick={save}>
            Save
          </button>
        </div>
      )}
    </CreateAssessment>
  );
}

const CreateAssessment = styled.div`
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

  .pending-registrations-heading {
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

  .assessment-info {
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

  .assessment-info-label {
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

  .assessment-text-field {
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
    margin: 20px;
    width: 100%;
  }

  .new-question {
    border: 2px solid white;
    border-radius: 10px;
    margin-top: 30px;
    display: flex;
    width: 80%;
    justify-content: space-evenly;
    /* align-self: center; */
    align-items: center;
    background-color: #282c34;
  }

  /* .expand{
    width: 75%;
  } */

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
    margin: 20px;
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
`;

export default CreateAssessments;
