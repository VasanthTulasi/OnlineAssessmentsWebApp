//FIBTemplate
import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import SingleSelect from "react-select";

function FIBTemplate(props) {
  const textAreaComponent = useRef(null);
  const [blanksCount, setBlanksCount] = useState(props.correctFIBAnswers.length);
  const [correctBlankAnswers, setCorrectBlankAnswers] = useState(props.correctFIBAnswers);

  const saveFIBQuestion = (event) => {
    // console.log("triggered");
    let val = event.target.value;
    let changedVal = val.replace(" ___________ ", "");
    event.target.value = changedVal;
    
    try {
      let numberOfBlanks = changedVal.match(/____________/g).length;
      setBlanksCount(numberOfBlanks);
    } catch (err) {
      if (err.message === "Cannot read properties of null (reading 'length')")
      setBlanksCount(0);
    }
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveFIBQuestion(questionId, event.target.value);
    if(changedVal !== val){
      props.removeFIBAnswer(questionId);  
    }
  };

  const setCorrectAnswers = (event) => {
      const index = event.target.id.split("_")[2];
      const questionId = textAreaComponent.current.id.split("_")[3];
      props.saveFIBAnswers(questionId,index,event.target.value);
  }

  const addBlank = () => {
    let curText = textAreaComponent.current.value;
    let curPosition = textAreaComponent.current.selectionStart;
    let finalText =
      curText.substring(0, curPosition) +
      " ____________ " +
      curText.substring(curPosition);
    textAreaComponent.current.value = finalText;
    textAreaComponent.current.focus();
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveFIBQuestion(questionId, textAreaComponent.current.value);
    try {
      let numberOfBlanks = finalText.match(/____________/g).length;
      setBlanksCount(numberOfBlanks);
    } catch (err) {
      if (err.message === "Cannot read properties of null (reading 'length')")
        setBlanksCount(0);
    }
  };

  return (
    <FIB>
      <label className="label-class" style={{ marginTop: 0 }}>
        Enter the Fill-in-the-blank Question
      </label>
      <textarea
        ref={textAreaComponent}
        id={"fib_text_area_" + props.indexVal}
        className="text-area"
        onChange={saveFIBQuestion}
        rows="3"
        defaultValue={props.questionText}
        // onFocus={() => setButtonVisibility("add-blank-button")}
        // onBlur={checkBlanks}
      />
      <button
        className="add-blank-button"
        id={"add_blank_" + props.indexVal}
        onClick={addBlank}
      >
        Add a blank at cursor
      </button>
      <br />
      {Array.from({ length: blanksCount }).map((ele,index) => {
        return (
          <>
            <br />
            <label className="label-class">
              Enter Correct Answer for Blank {index+1}
            </label>
            <br />
            <input
              onChange={(event) => setCorrectAnswers(event)}
              className="blanks-answer-field"
              id={"blank_answer_"+index}
              placeholder="Correct Answer"
              defaultValue={props.correctFIBAnswers[index]}
            />
          </>
        );
      })}
    </FIB>
  );
}

const FIB = styled.div`
  margin-top: 10px;
  /* border: 1px solid red; */

  .label-class {
    display: inline-block;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 5px;
  }

  .blanks-answer-field {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    border: 1px solid #282c34;
    margin-top: 5px;
    border-radius: 5px;
    width: 400px;
    height: 35px;
    padding-left: 10px;
  }

  /* .icon-class {
    display: inline-block;
    position: relative;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 5px;
  }

  .icon-text {
    visibility: hidden;
    position: absolute;
    z-index: 1;
    border: 1px solid red;
    background-color: #282c34;
    width: 150px;
    padding: 0 5px;
  }

  .icon-class:hover .icon-text {
    visibility: visible;
  } */

  .text-area {
    width: 100%;
    color: black;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    padding: 5px;
    border-radius: 5px;
    margin-top: 5px;
    resize: none;
  }

  .no-display {
    display: none;
  }

  .add-blank-button {
    margin-top: 5px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 13px;
    font-weight: 600;
    width: max-content;
    border-radius: 25px;
    padding: 4px 10px 4px 10px;
    text-align: center;
  }

  .add-blank-button:hover {
    cursor: pointer;
  }
`;

export default FIBTemplate;
