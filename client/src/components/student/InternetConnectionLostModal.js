import React, { useState } from "react";
import styled from "styled-components";

function InternetConnectionLostModal(props) {
  return (
    <InternetConnectionLost>
      <ModalBox>
        <div className="main-heading">No Internet Connection!</div>
        <br />
        <br />
        <label className="modal-heading">
          Please reconnect with stable internet connection to continue your
          assessment.
          <br />
          <b>Your assessment timer will be paused until you reconnect.</b>
          <br />
        </label>
      </ModalBox>
    </InternetConnectionLost>
  );
}

const InternetConnectionLost = styled.div`
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
  margin-top: 72px;
  z-index: 9999;
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
  /* margin-top: 60px; */
  overflow-y: auto;

  .modal-heading {
    color: black;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .main-heading {
    color: black;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 20px;
    font-weight: 400;
    margin-top: 25px;
    text-align: center;
  }

  .modal-buttons {
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
    letter-spacing: 1px;
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
  }

  .modal-button:hover {
    cursor: pointer;
  }
`;

export default InternetConnectionLostModal;
