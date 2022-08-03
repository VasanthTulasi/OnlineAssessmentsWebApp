import React from "react";
import styled from 'styled-components';
import {useLocation} from "react-router-dom";

function EvaluateSubmission() {
  const {state} = useLocation();
  return <Eval>{state.assessment_id} and {state.student_uni_id}</Eval>;
}

const Eval = styled.div`
  height: 100vh;
  width: 100%;
  background-color: #282c34;
  color: #61dafb;
  /* font-size: 50px; */
  padding-top: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;


export default EvaluateSubmission;
