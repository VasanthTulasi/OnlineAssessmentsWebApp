import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import SingleSelect from "react-select";

function CodingTemplate(props) {
  const { question, questionIndex, totalQuestions, assessment_id } = props;
  const textAreaComponent = useRef(null);
  const codingLanguageComponent = useRef(null);

  const programmingLanguages =
    question.codingLanguage === "Any"
      ? [
          { label: "Java", value: "Java" },
          { label: "Python", value: "Python" },
          { label: "C++", value: "C++" },
          { label: "C Language", value: "C Language" },
        ]
      : [{ label: question.codingLanguage, value: question.codingLanguage }];

  const saveCodingAnswer = (event) => {
    props.saveCodingAnswer(questionIndex, event.target.value);
  };

  const saveCodingLanguage = (selOption) => {
    if (question.codingLanguage === "Any")
      localStorage.setItem(
        assessment_id + "_coding_language_" + String(questionIndex),
        selOption.value
      );
    props.saveCodingLanguage(questionIndex, selOption.value);
  };

  useEffect(() => {
    const initialArray = [];
    const codingLanguage =
      question.codingLanguage === "Any"
        ? localStorage.getItem(
            assessment_id + "_coding_language_" + String(questionIndex)
          )
        : question.codingLanguage;
    const codingAnswer = localStorage.getItem(
      assessment_id + "_answer_" + String(questionIndex)
    );
    if (codingLanguage == null) initialArray.push("");
    else initialArray.push(codingLanguage);

    initialArray.push(codingAnswer);
    console.log("init arry"+ initialArray);
    props.saveInitialCodingArray(questionIndex, initialArray);
  }, []);

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "400px",
      height: "35px",
      marginLeft: "20px",
      marginTop: "20px",
    }),
    valueContainer: (provided) => ({
      ...provided,
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
    <CodingAnswer>
      <div className="question-number">
        Question {questionIndex + 1} / {totalQuestions}
      </div>
      <div className="question-text">{question.questionText}</div>
      <div>
        <SingleSelect
          ref={codingLanguageComponent}
          id={"coding_language_" + props.indexVal}
          options={programmingLanguages}
          styles={customStyles}
          placeholder="Select or Search the Programming Language"
          onChange={saveCodingLanguage}
          noOptionsMessage={() => "This programming language is not available"}
          isDisabled={question.codingLanguage !== "Any" ? true : false}
          defaultValue={() => {
            return question.codingLanguage === "Any"
              ? {
                  label: localStorage.getItem(
                    assessment_id + "_coding_language_" + String(questionIndex)
                  ),
                  value: localStorage.getItem(
                    assessment_id + "_coding_language_" + String(questionIndex)
                  ),
                }
              : {
                  label: question.codingLanguage,
                  value: question.codingLanguage,
                };
          }}
        />
      </div>
      <textarea
        className="text-area"
        onBlur={saveCodingAnswer}
        rows="10"
        placeholder="Type your code here... It will be autosaved as you write."
        onChange={(event) =>
          localStorage.setItem(
            assessment_id + "_answer_" + String(questionIndex),
            event.target.value
          )
        }
        defaultValue={localStorage.getItem(
          assessment_id + "_answer_" + String(questionIndex)
        )}
      />
    </CodingAnswer>
  );
}

const CodingAnswer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background: #61dafb;
  margin: 10px 40px 0 40px;

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
    border-bottom: 1px solid #282c34;
  }

  .question-text {
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 20px;
    border-top: 0;
    color: black;
    /* margin: 20px 0 20px 0; */
    border-bottom: 1px solid #282c34;
  }

  .text-area {
    /* width: 100%; */
    color: black;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 18px;
    font-weight: 400;
    padding: 10px;
    border-radius: 10px;
    margin: 20px 20px 20px 20px;
    resize: none;
    border: 1px solid #282c34;
    /* background-color: #282c34; */
    /* color: white; */
  }
`;

export default CodingTemplate;
