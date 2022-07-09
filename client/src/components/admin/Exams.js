import React from 'react';
import styled from "styled-components";

function Exams() {
  return (
    <Exam>Exams Info</Exam>
  );
}

const Exam = styled.div`
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

export default Exams