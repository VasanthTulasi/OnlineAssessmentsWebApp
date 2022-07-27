import React, {useState} from "react";
import styled from "styled-components";

function ConfirmDeleteModal(props) {
  return (
    <Main>
      <ModalBox>
        <div className="main-heading">Assessment Instructions</div>
        <br/>
        <br/>
        <label className="modal-heading">Assesment Title: {props.assessmentTitle}</label>
        <br/>
        <br/>
        <label className="modal-heading">
           (1) The questions will be shown one at a time.<br/>
           (2) Only after the answer for a question is submitted, the next question will be displayed.<br/>
           (3) Once the answer for a question is submitted, it is not possible to go back and change it.<br/>
           (4) Please click on 'Save and Next' button once you have written or chosen your answer for the question.<br/>
           (5) Please do not refresh the browser window or close it during the assessment.<br/>
           (6) Close all the other tabs in the browser and do not open any new tags during the assessment.<br/>
           (7) You can see the timer to keep track of the remaining time during the assessment. <br/>
           (8) The timer runs on the server and you can login again to continue the assessment even you lose your internet connection.<br/>
           (9) Click on 'Proceed' button below to being the assessment.<br/>
        </label>
        <br />
        <br />
        <div className="modal-buttons">
          <button
            className="modal-button"
            onClick={props.doNotProceed}
          >
            Cancel and Go Back
          </button>
          <button
            className="modal-button"
            onClick={props.proceedWithAssessment}
          >
            Proceed
          </button>
        </div>
      </ModalBox>
    </Main>
  );
}

const Main = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #282c34;  
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  /* position: fixed; */
  /* background: rgba(0, 0, 0, 0.8); */
  background: #61dafb;
  width: max-content;
  height: max-content;
  max-height: 80vh;
  padding: 35px;
  border-radius: 10px;
  border: 1px solid black;
  /* bottom: 60px; */
  margin-top: 60px;
  overflow-y: auto;
  
  .modal-heading {
    color: black;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .main-heading{
    color:black;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 20px;
    font-weight: 400;
    margin-top: 25px;
    text-align: center;
  }

  .modal-buttons{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .modal-button {
    margin-top: 10px;
    border: 1px solid #282c34;
    /* color: #282c34; */
    color: white;
    background-color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 15px;
    font-weight: 400;
    width: max-content;
    /* height: 40px; */
    /* letter-spacing: 3px; */
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
  }

  .modal-button:hover {
    cursor: pointer;
  }
`;

export default ConfirmDeleteModal;
