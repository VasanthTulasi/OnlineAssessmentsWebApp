import React, {useState} from "react";
import styled from "styled-components";

function ConfirmDeleteModal(props) {
  return (
    <Main>
      <ModalBox>
        <label className="modal-heading">
           Are you sure you want to delete this assessment?<br/><br/>Assessment Title: {props.assessmentInfo}
        </label>
        <br />
        <br />
        <div className="modal-buttons">
          <button
            className="modal-button"
            onClick={props.confirmedDeletion}
          >
            YES
          </button>
          <button
            className="modal-button"
            onClick={props.setModalVisibility}
          >
            NO
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
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  position: fixed;
  width: max-content;
  height: max-content;
  background: #282c34;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid white;

  .modal-heading {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 25px;
  }

  .modal-reason {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 18px;
    font-weight: 400;
    border: 1px solid #282c34;
    margin-top: 5px;
    border-radius: 5px;
    width: 400px;
    height: 40px;
    padding-left: 10px;
  }

  .modal-buttons{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .modal-button {
    margin-top: 5px;
    border: 1px solid #282c34;
    color: #282c34;
    background-color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 12px;
    font-weight: 700;
    width: max-content;
    height: 40px;
    letter-spacing: 3px;
    border-radius: 25px;
    padding: 0 20px 0 20px;
  }

  .modal-button:hover {
    cursor: pointer;
  }
`;

export default ConfirmDeleteModal;
