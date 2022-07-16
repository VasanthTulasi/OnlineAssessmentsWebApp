import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import SingleSelect from "react-select";
import Axios from "axios";
import BodyImage from "../../svgs/body_background.svg";
import MCQTemplate from "./QuestionTemplates/MCQTemplate";
import FIBTemplate from "./QuestionTemplates/FIBTemplate";
import EssayTemplate from "./QuestionTemplates/EssayTemaplate";
import CodingTemplate from "./QuestionTemplates/CodingTemplate";
import QuestionTypeDropdown from "./QuestionTypeDropdown";

function CreateExams() {
  const [moduleCodesFromDB, setModuleCodesFromDB] = useState([]);
  const [moduleCode, setModuleCode] = useState("");
  const [questions, setQuestions] = useState([]);

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/modules",
    crossDomain: true,
  });

  //Question Type Methods
  const changeQuestionType = (index, val) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionType = val;
    setQuestions(modQuestionArr);
    console.log(index);
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

  useEffect(() => {
    axios.get("/moduleCodes").then((res) => {
      let moduleCodes = res.data;
      moduleCodes = moduleCodes.map((ele) => {
        return { value: ele, label: ele };
      });
      setModuleCodesFromDB(moduleCodes);
    });
  }, []);

  useEffect(() => {
    console.log("Updated questions:\n"+JSON.stringify(questions));
  }, [questions]);

  const moduleCodeSelected = (selOption) => {
    setQuestions([]);
    setModuleCode(selOption.value);
  };

  useEffect(() => {
    setQuestions([
      {
        id: 0,
        questionType: "mcq",
        questionText: "",
        options: [],
        correctAnswer: "",
      },
    ]);
  }, [moduleCode]);

  const addNewQuestion = () => {
    setQuestions((prevState) => [
      ...prevState,
      {
        id: questions.length,
        questionType: "mcq",
        questionText: "",
        options: [],
        correctAnswer: "",
      },
    ]);
  };

  const removeQuestion = (event) => {
    const index = event.currentTarget.id.split("_")[2];
    let modQuestionArray = [...questions];
    modQuestionArray.splice(index, 1);
    setQuestions(modQuestionArray);
  };

  const save = () => {
    // let finalQuestionArray = [...questions];
    // finalQuestionArray = finalQuestionArray.map((ele, ind) => {
    //   return {...ele , id: ind };
    // });
    // setQuestions(finalQuestionArray);
    console.log(JSON.stringify(questions));
  };

  const customStyles1 = {
    valueContainer: (provided) => ({
      ...provided,
      width: "400px",
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
    <CreateExam>
      <div className="pending-registrations-heading">Create an Exam</div>
      <div className="module-select">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <label className="select-module-label">Select Module Code</label>
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
      </div>
      <div className="questions">
        {moduleCode !== "" &&
          questions.map((ele, index) => {
            return (
              <div key={ele.id} className="new-question">
                <div className="question-number">{index + 1}</div>
                <div className="question-content">
                  <label className="select-module-label">
                    Select Question Type
                  </label>
                  <QuestionTypeDropdown indexVal={index} changeQuestionType={changeQuestionType} />
                  {ele.questionType === "mcq" && (
                    <MCQTemplate
                      indexVal={index}
                      saveMCQQuestion={saveMCQQuestion}
                      saveMCQQuestionOptions={saveMCQQuestionOptions}
                      saveMCQCorrectAnswer={saveMCQCorrectAnswer}
                    />
                  )}
                  {ele.questionType === "fib" && <FIBTemplate />}
                  {ele.questionType === "essay" && <EssayTemplate />}
                  {ele.questionType === "coding" && <CodingTemplate />}
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
    </CreateExam>
  );
}

const CreateExam = styled.div`
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

  .module-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* border:1px solid red; */
    /* width: 100%; */
    /* text-align: center; */
    /* display:table; */
    /* margin-left: calc(150% - var(--width)); */
  }

  .select-module-label {
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

  .questions {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    flex-direction: column;
    /* border: 1px solid red; */
    margin: 20px 20px 0 20px;
  }

  .new-question {
    border: 2px solid white;
    border-radius: 10px;
    margin-top: 40px;
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

export default CreateExams;
