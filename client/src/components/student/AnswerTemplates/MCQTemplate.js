import React, { useEffect, useState } from "react";
import styled from "styled-components";

function MCQTemplate(props) {
  const { question, questionIndex, totalQuestions } = props;
  const [selectedOptionIndex, setSelectedOptionIndex] = useState("");

  const mcqOptionClicked = (highlightIndex, selVal) => {
    setSelectedOptionIndex(String(highlightIndex));
    props.mcqOptionClicked(questionIndex, selVal);
  };

  useEffect(() => {
    console.log("Triggered");
    setSelectedOptionIndex("");
  }, [question]);
  

  const getOptionDivs = () => {
    let options = [];
    for (let i = 0; i < question.options.length; i++) {
      options.push(
          <div
            className={
              selectedOptionIndex == String(i)
                ? "question-option highlight"
                : "question-option"
            }
            onClick={(event) => mcqOptionClicked(i, event.target.textContent)}
          >
            {question.options[i]}
          </div>
      );
    }
    return options;
  };

  const getOptionSubDivs = () => {
    const optionDivs = getOptionDivs();
    const finalOptionDivs = [];
    for (let i = 0; i < question.options.length; i++) {
      if (i % 2 == 0) {
        finalOptionDivs.push(
          <div className="question-options-sub">
            {optionDivs.map((ele, index) => {
              if (index >= i && index < i + 2) {
                return ele;
              }
            })}
          </div>
        );
      }
    }

    return finalOptionDivs;
  };

  return (
    <MCQAnswer>
      <div className="question-number">
        Question {questionIndex + 1} / {totalQuestions}
      </div>
      <div className="question-text">{question.questionText}</div>
      <div className="question-options">
        {getOptionSubDivs().map((ele) => ele)}
      </div>
    </MCQAnswer>
  );
}

const MCQAnswer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background: #61dafb;
  margin: 20px 40px 0 40px;

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
    color: white;
    border: 1px solid black;
    background-color: #282c34;
  }

  .highlight {
    color: #282c34;
    /* font-weight: bold; */
    border: 2px solid black;
    background-color: #f5edf0;
    /* F5EDF0 */
  }

  .question-option:hover {
    cursor: pointer;
    /* color: black; */
    /* background-color: #fffff7; */
    /* border: 1px solid black; */
  }
`;

export default MCQTemplate;
