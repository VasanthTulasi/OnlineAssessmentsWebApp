import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SingleSelect from "react-select";
import Axios from "axios";
import BodyImage from "../../svgs/body_background.svg";
import MCQTemplate from "./QuestionTemplates/MCQTemplate";
import FIBTemplate from "./QuestionTemplates/FIBTemplate";
import EssayTemplate from "./QuestionTemplates/EssayTemaplate";
import CodingTemplate from "./QuestionTemplates/CodingTemplate";

function CreateExams() {
  const [moduleCodesFromDB, setModuleCodesFromDB] = useState([]);
  const [moduleCode, setModuleCode] = useState("");
  const [questionType, setQuestionType] = useState("mcq");
  // const [questionNumber, setQuestionNumber] = useState(0);
  const [questions, setQuestions] = useState([]);
  
  console.log("Question id "+questions.length);
  // const [questionTemplate, setQuestionTemplate] = useState();
  const expandDivClassName = "new-question expand"
  const questionTypes = [
    { label: "Multiple Choice Question", value: "mcq" },
    { label: "Fill in the Blank", value: "fib" },
    { label: "Essay", value: "essay" },
    { label: "Coding", value: "coding" },
  ];

  // const questionTemplates = [
  //   <MCQTemplate/>,
  //   <FIBTemplate/>,
  //   <EssayTemplate/>,
  //   <CodingTemplate/>,
  // ];

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/modules",
    crossDomain: true,
  });

  const enteredMCQOptions = (event) => {
    const val = event.currentTarget.id.split("_")[2];
    console.log(val);
  }
  

  useEffect(() => {
    axios.get("/moduleCodes").then((res) => {
      let moduleCodes = res.data;
      moduleCodes = moduleCodes.map((ele) => {
        return { value: ele, label: ele };
      });
      setModuleCodesFromDB(moduleCodes);
    });
  }, []);

  const moduleCodeSelected = (selOption) => {
    setModuleCode(selOption.value);

  };

  const questionTypeSelected = (selOption) => {
    setQuestionType(selOption.value);
    // switch (selOption.value) {
    //   case "mcq":
    //     setQuestionTemplate(questionTemplates[0]);
    //     break;
    //   case "fib":
    //     setQuestionTemplate(questionTemplates[1]);
    //     break;
    //   case "essay":
    //     setQuestionTemplate(questionTemplates[2]);
    //     break;
    //   case "coding":
    //     setQuestionTemplate(questionTemplates[3]);
    //     break;
    // }
  };

  const addNewQuestion = () => {
    // console.log("Called")
    setQuestions([...questions, ""]);
    // setQuestionNumber(preVal => preVal + 1 )
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

  const customStyles2 = {
    ...customStyles1,
    container: (provided) => ({
      ...provided,
      width: "400px",
      // paddingLeft: "10px",
      marginTop: "10px",
      color: "black",
      font: "17px",
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: "12px",
      fontWeight: 400,
      color: "#282c34",
    }),
  };

  return (
    <CreateExam>
      <div className="pending-registrations-heading">Create an Exam</div>
      <div className="module-select">
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
      <div className="questions">
        {questions.map((ele, index) => {
          return (
            <div className="new-question">
              <div className="question-number">{index + 1}</div>
              <div className="question-content">
                <label className="select-module-label">
                  Select Question Type
                </label>
                <SingleSelect
                  options={questionTypes}
                  styles={customStyles2}
                  placeholder="Select Question Type"
                  onChange={questionTypeSelected}
                  defaultValue={questionTypes}
                  noOptionsMessage={() => "Option Not Available"}
                />
                {questionType === "mcq" && <MCQTemplate templateId={index} enteredMCQOptions={enteredMCQOptions}/>}
                <button className="remove-question-button">
                  Remove This Question
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center" }}>
        <button className="new-question-button" onClick={addNewQuestion}>
          Add New Question
        </button>
      </div>
    </CreateExam>
  );
}

const CreateExam = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  /* background-color: #282c34; */
  background-image: url("${BodyImage}");
  background-repeat: repeat;
  background-size: auto;
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
    border: 1px solid white;
    border-radius: 10px;
    margin-top: 20px;
    display: flex;
    width: 75%;
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
    margin-top: 15px;
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
