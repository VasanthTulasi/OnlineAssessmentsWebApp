import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import SingleSelect from "react-select";

function FIBTemplate(props) {
  const textAreaComponent = useRef(null);

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "400px",
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
    multiValue: (provided) => ({
      ...provided,
      fontSize: "20px",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      "&:hover": {
        backgroundColor: "#282c34",
        color: "white",
      },
    }),
  };

  const saveFIBQuestion = (event) => {
    // checkIfBlanksChanged(event.target.value);
    let val  = event.target.value;
    val = val.replace(" ___________ ",""); 
    textAreaComponent.current.value = val;
    // const questionId = textAreaComponent.current.id.split("_")[3];
    // props.saveFIBQuestion(questionId, event.target.value);
  };

  // const checkIfBlanksChanged = (currentText) => {
    
  // }

  const addBlank = () => {
    textAreaComponent.current.value = textAreaComponent.current.value + " ____________ ";
    textAreaComponent.current.focus();
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveFIBQuestion(questionId, textAreaComponent.current.value);
  };

  const removeBlank = () => {
    let val = textAreaComponent.current.selectionEnd;
    let curText = textAreaComponent.current.value;
    curText = curText.substring(0, val - 1) + curText.substring(val, curText.length);
    let removeVal = curText;
    removeVal = removeVal.replace(" ___________ ",""); 
    textAreaComponent.current.value = removeVal;
    textAreaComponent.current.focus();
  };

  const makeButtonsVisible = () => {};

  return (
    <FIB>
      <label className="label-class" style={{ marginTop: 0 }}>
        Enter the Fill-in-the-blank Question
      </label>
      <br />
      <textarea
        ref={textAreaComponent}
        id={"fib_text_area_" + props.indexVal}
        className="text-area"
        onChange={saveFIBQuestion}
        rows="3"
        defaultValue={props.questionText}
        // onFocus={() => setButtonVisibility("add-blank-button")}
        //onBlur={() => setButtonVisibility("no-display")}
      />
      <button
        className="add-blank-button"
        id={"add_blank_" + props.indexVal}
        onClick={addBlank}
      >
        Add a blank at cursor
      </button>
      <button
        className="add-blank-button"
        id={"add_blank_" + props.indexVal}
        onClick={removeBlank}
        style={{ marginLeft: "10px" }}
      >
        Remove the blank at cursor
      </button>
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

  .text-area {
    width: 100%;
    color: black;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    padding: 5px;
    border-radius: 5px;
    margin-top: 5px;
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
