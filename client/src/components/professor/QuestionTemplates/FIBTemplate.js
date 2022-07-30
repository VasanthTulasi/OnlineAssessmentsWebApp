//FIBTemplate
import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";

function FIBTemplate(props) {
  const textAreaComponent = useRef(null);
  const [blanksCount, setBlanksCount] = useState(
    props.correctFIBAnswers.length
  );
  const [correctBlankAnswers, setCorrectBlankAnswers] = useState(
    props.correctFIBAnswers
  );
  const [errorMessageStyle,setErrorMessageStyle]  = useState({display:"none"})
  const [errorMessage,setErrorMessage] = useState("");
  // useEffect(() => {
  //   const correctBlankAnswersWithKeys = correctBlankAnswers;
  //   correctBlankAnswersWithKeys.map((ele,index) => {
  //       return {keyId: index,...ele};
  //   })
  //   setNextOptionKeyId(correctBlankAnswersWithKeys.length);
  // }, []);

  const saveFIBQuestion = () => {
    console.log("save fib triggered");
    // if (checkIfEditingInsideBlank()) return;
    let quesTextArr = textAreaComponent.current.value.split("____________");
    const finalQuesTextArr = removeUnwantedBlanks(quesTextArr);
    textAreaComponent.current.value = finalQuesTextArr.join("____________");
    setBlanksCount(quesTextArr.length - 1);
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveFIBQuestion(questionId, textAreaComponent.current.value);
  };

  const checkIfEditingInsideBlank = (eventType) => {
    if (eventType === "Backspace" || eventType === "Delete" || eventType==="ArrowLeft" || eventType === "ArrowRight") return;
    const position = textAreaComponent.current.selectionStart;
    const prevChar = textAreaComponent.current.value[position - 2];
    const nextChar = textAreaComponent.current.value[position];
    if (prevChar === "_" && nextChar === "_") {
      let cleanText = String(textAreaComponent.current.value);
      cleanText =
        cleanText.substring(0, position - 1) + cleanText.substring(position);
      textAreaComponent.current.value = cleanText;
      // alert("Invalid Operation! Cannot insert text inside a blank.");
      setErrorMessage("Invalid Operation! Cannot insert text inside a blank.");
      setErrorMessageStyle({display:"block"})
      // return true;
    }
    // return false;
  };

  const checkIfAddingInBlank = () => {
    const currentPos = textAreaComponent.current.selectionStart;
    const prevChar = textAreaComponent.current.value[currentPos - 1];
    const nextChar = textAreaComponent.current.value[currentPos];
    if (prevChar === "_" && nextChar === "_") {
      setErrorMessage("Invalid operation! Cannot insert a blank inside another blank.");
      setErrorMessageStyle({display:"block"});
      return true;
    }
    return false;
  };

  const removeUnwantedBlanks = (quesTextArr) => {
    for (let i = 0; i < quesTextArr.length; i++) {
      let textArr = quesTextArr[i];
      quesTextArr[i] = quesTextArr[i].replace("___________", "");
      if (textArr !== quesTextArr[i]) {
        const questionId = textAreaComponent.current.id.split("_")[3];
        props.removeFIBAnswer(questionId);
      }
    }
    return quesTextArr;
  };

  const setCorrectAnswers = (event) => {
    const index = event.target.id.split("_")[2];
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveFIBAnswers(questionId, index, event.target.value);
  };

  const addBlank = () => {
    setErrorMessageStyle({display:"none"})
    if (checkIfAddingInBlank()) return;
    console.log("continue");
    let curText = textAreaComponent.current.value;
    let curPosition = textAreaComponent.current.selectionStart;
    let blankCount = curText.split("____________").length;
    let finalText =
      curText.substring(0, curPosition) +
      " ____________ " +
      curText.substring(curPosition);
    textAreaComponent.current.value = finalText;
    textAreaComponent.current.focus();
    setBlanksCount(blankCount);
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveFIBQuestion(questionId, textAreaComponent.current.value);
  };

  const keyPressed = (event) => {
    setErrorMessageStyle({display:"none"})
    checkIfEditingInsideBlank(event.code);
    if (event.code === "Backspace" || event.code === "Delete")
        saveFIBQuestion();
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
        onKeyUp={keyPressed}
        onBlur={saveFIBQuestion}
        rows="3"
        defaultValue={props.questionText}
      />
      <div style={errorMessageStyle}>{errorMessage}</div>
      <button
        className="add-blank-button"
        id={"add_blank_" + props.indexVal}
        onClick={addBlank}
      >
        Add a blank at the cursor
      </button>
      <br />
      {Array.from({ length: blanksCount }).map((ele, index) => {
        return (
          <>
            <br />
            <label className="label-class">
              Enter Correct Answer for Blank {index + 1}
            </label>
            <br />
            <input
              onBlur={(event) => setCorrectAnswers(event)}
              className="blanks-answer-field"
              id={"blank_answer_" + index}
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
