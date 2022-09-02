import React from "react";
import styled from "styled-components";
import FIBTemplate from "../professor/QuestionTemplates/FIBTemplate";
import MCQTemplate from "../professor/QuestionTemplates/MCQTemplate";
import { useNavigate, useLocation } from "react-router-dom";

function ViewDiscussions() {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <ViewDis>
      <div className="heading">Discussions</div>
      {state.question.questionType === "fib" && (
        <FIBTemplate
          indexVal={0}
          saveFIBQuestion={() => {}}
          saveFIBAnswers={() => {}}
          saveFIBAnswerTypes={() => {}}
          removeFIBAnswer={() => {}}
          questionText={state.question.questionText}
          correctFIBAnswers={state.question.correctFIBAnswers}
          correctFIBAnswerTypes={state.question.correctFIBAnswerTypes}
          isDisabled={true}
        />
      )}
      {state.question.questionType === "mcq" && (
        <MCQTemplate
          indexVal={0}
          saveMCQQuestion={() => {}}
          saveMCQQuestionOptions={() => {}}
          saveMCQCorrectAnswer={() => {}}
          questionText={state.question.questionText}
          options={state.question.options}
          correctAnswer={state.question.correctAnswer}
          isDisabled={true}
        />
      )}
    </ViewDis>
  );
}

const ViewDis = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #282c34;
  color: #61dafb;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 20px;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 72px;

  .heading {
    margin-top: 30px;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
  }
`;

export default ViewDiscussions;
