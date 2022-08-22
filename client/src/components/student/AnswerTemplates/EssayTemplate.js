import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { LoginContext } from "../../../contexts/LoginContext";

function EssayTemplate(props) {
  const { question, questionIndex, totalQuestions, assessment_id } = props;
  const { loggedInUserDetails } = useContext(LoginContext);
  const uniId = loggedInUserDetails.uni_id;

  return (
    <EssayAnswer>
      <div className="question-number">
        Question {questionIndex + 1} / {totalQuestions}
      </div>
      <div className="question-text">{question.questionText}</div>
      <textarea
        className="text-area"
        onBlur={(event) =>
          props.saveEssayAnswer(questionIndex, event.target.value)
        }
        rows="10"
        placeholder="Write your answer here... It will be autosaved as you write."
        onChange={(event) =>
          localStorage.setItem(
            assessment_id + "_" + uniId + "_answer_" + String(questionIndex),
            event.target.value
          )
        }
        defaultValue={localStorage.getItem(
          assessment_id + "_" + uniId + "_answer_" + String(questionIndex)
        )}
      />
    </EssayAnswer>
  );
}

const EssayAnswer = styled.div`
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

export default EssayTemplate;
