import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";

function FIBTemplate(props) {
  const textAreaComponent = useRef(null);
  const [correctBlankAnswers, setCorrectBlankAnswers] = useState([]);
  const [correctBlankAnswerTypes, setCorrectBlankAnswerTypes] = useState([]);
  const [errorMessageStyle, setErrorMessageStyle] = useState({
    display: "none",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [nextKey, setNextKey] = useState(null);
  const [nextKeyForType, setNextKeyForType] = useState(null);
  const [randomNumberReferences, setRandomNumberReferences] = useState("");

  useEffect(() => {
    let correctBlankAnswersWithKeys = props.correctFIBAnswers;
    correctBlankAnswersWithKeys = correctBlankAnswersWithKeys.map(
      (ele, index) => {
        return { key_id: index, answer: ele };
      }
    );
    setCorrectBlankAnswers(correctBlankAnswersWithKeys);
    setNextKey(correctBlankAnswersWithKeys.length);

    let correctBlankAnswerTypesWithKeys = props.correctFIBAnswerTypes;
    correctBlankAnswerTypesWithKeys = correctBlankAnswerTypesWithKeys.map(
      (ele, index) => {
        return { key_id: index, answerType: ele };
      }
    );
    setCorrectBlankAnswerTypes(correctBlankAnswerTypesWithKeys);
    setNextKeyForType(correctBlankAnswerTypesWithKeys.length);
    updateRandomNumberReferences();
  }, []);

  const saveFIBQuestion = () => {
    const questionId = textAreaComponent.current.id.split("_")[3];
    if (textAreaComponent.current.value === "") {
      props.saveFIBQuestion(questionId, "");
      removeAllBlanksFromArray();
      updateRandomNumberReferences();
      return;
    }

    let quesTextArr = textAreaComponent.current.value.split("____________");
    const { finalQuesTextArr, removedIndex } = removeBlank(quesTextArr);
    textAreaComponent.current.value = finalQuesTextArr.join("____________");
    if (removedIndex != null) removeBlankFromArray(removedIndex);

    let quesTextArrForRand = textAreaComponent.current.value.split("*RandNum*");
    const { finalQuesTextArrForRand, removedIndexForRand } =
      removeRandNumber(quesTextArrForRand);
    textAreaComponent.current.value = finalQuesTextArrForRand.join("*RandNum*");
    // if (removedIndexForRand != null) removeRandNumberFromArray(removedIndexForRand);
    updateRandomNumberReferences();

    props.saveFIBQuestion(questionId, textAreaComponent.current.value);
  };

  const checkIfEditingInsideBlank = (eventType) => {
    if (
      eventType === "Backspace" ||
      eventType === "Delete" ||
      eventType === "ArrowLeft" ||
      eventType === "ArrowRight"
    )
      return;
    const position = textAreaComponent.current.selectionStart;
    const prevChar = textAreaComponent.current.value[position - 2];
    const nextChar = textAreaComponent.current.value[position];
    if (prevChar === "_" && nextChar === "_") {
      let cleanText = String(textAreaComponent.current.value);
      cleanText =
        cleanText.substring(0, position - 1) + cleanText.substring(position);
      textAreaComponent.current.value = cleanText;
      setErrorMessage("Invalid Operation! Cannot insert text inside a blank.");
      setErrorMessageStyle({ display: "block" });
    }
  };

  const checkIfEditingInsideRandNum = (event) => {
    // console.log("trigggered");
    if (
      event.code === "Backspace" ||
      event.code === "Delete" ||
      event.code === "ArrowLeft" ||
      event.code === "ArrowRight" ||
      event.code === "End" ||
      event.code === "Home"
    )
      return;

    const curText = textAreaComponent.current.value;
    const curPos = textAreaComponent.current.selectionStart;
    let randNumIndicies = [];
    for (let i = 0; i < curText.length; i++) {
      let indexFound = curText.indexOf("*RandNum*", i);
      if (!randNumIndicies.includes(indexFound))
        randNumIndicies.push(indexFound);
    }
    randNumIndicies.pop();
    for (let i = 0; i < randNumIndicies.length; i++) {
      if (curPos > randNumIndicies[i] && curPos < randNumIndicies[i] + 9) {
        setErrorMessage(
          "Invalid operation! Cannot insert inside a random number."
        );
        setErrorMessageStyle({ display: "block" });
        event.preventDefault();
      }
    }
  };

  const checkIfAddingInBlank = () => {
    const currentPos = textAreaComponent.current.selectionStart;
    const prevChar = textAreaComponent.current.value[currentPos - 1];
    const nextChar = textAreaComponent.current.value[currentPos];
    if (prevChar === "_" && nextChar === "_") {
      setErrorMessage(
        "Invalid operation! Cannot insert a blank inside another blank."
      );
      setErrorMessageStyle({ display: "block" });
      return true;
    }
    return false;
  };

  const checkIfAddingInRandomNumber = () => {
    const curText = textAreaComponent.current.value;
    const curPos = textAreaComponent.current.selectionStart;
    let randNumIndicies = [];
    for (let i = 0; i < curText.length; i++) {
      let indexFound = curText.indexOf("*RandNum*", i);
      if (!randNumIndicies.includes(indexFound))
        randNumIndicies.push(indexFound);
    }
    randNumIndicies.pop();

    for (let i = 0; i < randNumIndicies.length; i++) {
      if (curPos > randNumIndicies[i] && curPos < randNumIndicies[i] + 9) {
        setErrorMessage(
          "Invalid operation! Cannot insert a random number inside another random number."
        );
        setErrorMessageStyle({ display: "block" });
        return true;
      }
    }
    return false;
  };

  const removeBlank = (quesTextArr) => {
    let removedIndex = null;
    for (let i = 0; i < quesTextArr.length; i++) {
      let textArr = quesTextArr[i];
      quesTextArr[i] = quesTextArr[i].replace("___________", "");
      if (textArr !== quesTextArr[i]) removedIndex = i;
    }
    const finalQuesTextArr = quesTextArr;
    return { finalQuesTextArr, removedIndex };
  };

  const removeRandNumber = (quesTextArrForRand) => {
    let removedIndexForRand = null;
    for (let i = 0; i < quesTextArrForRand.length; i++) {
      let textArrForRand = quesTextArrForRand[i];
      quesTextArrForRand[i] = quesTextArrForRand[i].replace("*RandNum", "");
      quesTextArrForRand[i] = quesTextArrForRand[i].replace("*RandNu*", "");
      quesTextArrForRand[i] = quesTextArrForRand[i].replace("*RandNm*", "");
      quesTextArrForRand[i] = quesTextArrForRand[i].replace("*Randum*", "");
      quesTextArrForRand[i] = quesTextArrForRand[i].replace("*RanNum*", "");
      quesTextArrForRand[i] = quesTextArrForRand[i].replace("*RadNum*", "");
      quesTextArrForRand[i] = quesTextArrForRand[i].replace("*RndNum*", "");
      quesTextArrForRand[i] = quesTextArrForRand[i].replace("*andNum*", "");
      quesTextArrForRand[i] = quesTextArrForRand[i].replace("RandNum*", "");
      if (textArrForRand !== quesTextArrForRand[i]) removedIndexForRand = i;
    }
    const finalQuesTextArrForRand = quesTextArrForRand;
    return { finalQuesTextArrForRand, removedIndexForRand };
  };

  const setCorrectAnswers = (event) => {
    const index = event.target.id.split("_")[2];
    let modCorrectOptionsArr = [...correctBlankAnswers];
    modCorrectOptionsArr[index].answer = event.target.value;
    setCorrectBlankAnswers(modCorrectOptionsArr);
  };

  const setCorrectAnswerType = (event) => {
    const index = event.target.id.split("_")[3];
    let modCorrectOptionTypesArr = [...correctBlankAnswerTypes];
    modCorrectOptionTypesArr[index].answerType = event.target.value;
    setCorrectBlankAnswerTypes(modCorrectOptionTypesArr);
  };

  useEffect(() => {
    const questionId = textAreaComponent.current.id.split("_")[3];
    const correctBlankAnswersWithoutKeys = correctBlankAnswers.map((ele) => {
      return ele.answer;
    });

    props.saveFIBAnswers(questionId, correctBlankAnswersWithoutKeys);
  }, [correctBlankAnswers]);

  useEffect(() => {
    const questionId = textAreaComponent.current.id.split("_")[3];
    const correctBlankAnswerTypesWithoutKeys = correctBlankAnswerTypes.map(
      (ele) => {
        return ele.answerType;
      }
    );

    props.saveFIBAnswerTypes(questionId, correctBlankAnswerTypesWithoutKeys);
  }, [correctBlankAnswerTypes]);

  const addBlank = () => {
    setErrorMessageStyle({ display: "none" });
    if (checkIfAddingInBlank()) return;
    let curText = textAreaComponent.current.value;
    let curPosition = textAreaComponent.current.selectionStart;
    addNewBlankInArray(curPosition);
    let finalText =
      curText.substring(0, curPosition) +
      " ____________ " +
      curText.substring(curPosition);
    // console.log("cur position is: " + (curPosition + 1));
    textAreaComponent.current.value = finalText;
    textAreaComponent.current.focus();
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveFIBQuestion(questionId, textAreaComponent.current.value);
  };

  const addRandomNumber = () => {
    setErrorMessageStyle({ display: "none" });
    if (checkIfAddingInRandomNumber()) return;
    let curText = textAreaComponent.current.value;
    let curPosition = textAreaComponent.current.selectionStart;
    // addNewRandomNumberInArray(curPosition);
    let finalText =
      curText.substring(0, curPosition) +
      " *RandNum* " +
      curText.substring(curPosition);
    textAreaComponent.current.value = finalText;
    textAreaComponent.current.focus();
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveFIBQuestion(questionId, textAreaComponent.current.value);
    updateRandomNumberReferences();
  };

  const updateRandomNumberReferences = () => {
    const curText = textAreaComponent.current.value;
    let randNumIndices = [];
    for (let i = 0; i < curText.length; i++) {
      let indexFound = curText.indexOf("*RandNum*", i);
      if (!randNumIndices.includes(indexFound)) randNumIndices.push(indexFound);
    }
    randNumIndices.pop();
    let randReferences = "";
    for (let i = 0; i < randNumIndices.length; i++) {
      if (i === randNumIndices.length - 1) randReferences += "rand_" + (i + 1);
      else randReferences += "rand_" + (i + 1) + ", ";
    }
    setRandomNumberReferences(randReferences);
  };

  const addNewBlankInArray = (position) => {
    const curText = textAreaComponent.current.value.substring(0, position);
    let numOfBlanks = 0;
    for (let i = 0; i < curText.length; i++) {
      if (curText[i] == "_") {
        let blankFound = true;
        for (let j = i; j < i + 12; j++) {
          if (curText[j] != "_") {
            blankFound = false;
            i = j;
            break;
          }
        }
        if (blankFound) {
          numOfBlanks++;
          i = i + 12;
        }
      }
    }

    let modCorrectOptionsArr = [...correctBlankAnswers];
    let modCorrectOptionTypesArr = [...correctBlankAnswerTypes];
    modCorrectOptionsArr.splice(numOfBlanks, 0, {
      key_id: nextKey,
      answer: "",
    });
    modCorrectOptionTypesArr.splice(numOfBlanks, 0, {
      key_id: nextKeyForType,
      answerType: "value",
    });
    setCorrectBlankAnswers([...modCorrectOptionsArr]);
    setCorrectBlankAnswerTypes([...modCorrectOptionTypesArr]);
    setNextKey((currentId) => currentId + 1);
    setNextKeyForType((currentId) => currentId + 1);
  };

  // const addNewRandomNumberInArray = () => {};

  const removeBlankFromArray = (index) => {
    let modCorrectOptionsArr = [...correctBlankAnswers];
    modCorrectOptionsArr.splice(index, 1);
    setCorrectBlankAnswers(modCorrectOptionsArr);

    let modCorrectOptionTypesArr = [...correctBlankAnswerTypes];
    modCorrectOptionTypesArr.splice(index, 1);
    setCorrectBlankAnswerTypes(modCorrectOptionTypesArr);
  };

  const removeAllBlanksFromArray = () => {
    setCorrectBlankAnswers([]);
    setCorrectBlankAnswerTypes([]);
  };

  const keyUp = (event) => {
    setErrorMessageStyle({ display: "none" });
    checkIfEditingInsideBlank(event.code);
    if (event.code === "Backspace" || event.code === "Delete")
      saveFIBQuestion();
  };

  const keyDown = (event) => {
    setErrorMessageStyle({ display: "none" });
    checkIfEditingInsideRandNum(event);
    if (event.code === "Backspace" || event.code === "Delete")
      saveFIBQuestion();
  };

  // const checkExpression = (event) => {
  //   const index = event.target.id.split("_")[2];
  //   if (correctBlankAnswerTypes[index].answerType === "value") return;
  //   let randNumRefsArray = randomNumberReferences.split(", ");
  //   const enteredFormula = correctBlankAnswers[index].answer;
  //   const formulaArray = enteredFormula.split(" ");

  //   for (let i = 0; i < formulaArray.length; i++) {
  //     if (
  //       !isNaN(formulaArray[i]) ||
  //       formulaArray[i] === "+" ||
  //       formulaArray[i] === "-" ||
  //       formulaArray[i] === "*" ||
  //       formulaArray[i] === "/" ||
  //       formulaArray[i] === "%"
  //     )
  //       continue;

  //     if (!randNumRefsArray.includes(formulaArray[i]))
  //       alert(formulaArray[i] + " is an invalid usage in the formula.");
  //   }

  //   try {
  //     let answer = eval(enteredFormula);
  //     console.log(answer);
  //   } catch (e) {
  //     if (
  //       !e.message.includes("is not defined") &&
  //       !e.message.includes("Invalid reference")
  //     )
  //       alert(e.message);
  //   }
  // };

  return (
    <FIB>
      <label className="label-class" style={{ marginTop: 0 }}>
        {props.isDisabled ? "Question" : "Enter the Fill-in-the-blank Question"}
      </label>
      <textarea
        ref={textAreaComponent}
        id={"fib_text_area_" + props.indexVal}
        className="text-area"
        onKeyUp={keyUp}
        onKeyDown={keyDown}
        onBlur={saveFIBQuestion}
        rows="3"
        defaultValue={props.questionText}
        disabled={props.isDisabled}
      />
      <div style={errorMessageStyle}>{errorMessage}</div>
      <button
        className="add-blank-button"
        id={"add_blank_" + props.indexVal}
        onClick={addBlank}
        style={{ display: props.isDisabled ? "none" : "inline-block" }}
      >
        Add a blank at the cursor
      </button>
      <span style={{ marginLeft: "5px" }} />
      <button
        className="add-blank-button"
        id={"add_random_" + props.indexVal}
        onClick={addRandomNumber}
        style={{ display: props.isDisabled ? "none" : "inline-block" }}
      >
        Add a random number at the cursor
      </button>
      {!props.isDisabled && randomNumberReferences && (
        <div className="label-class">
          Random number reference name(s) to write the mathematical formula:{" "}
          {randomNumberReferences}
        </div>
      )}
      <br />
      {/* <div style={{border: correctBlankAnswers.length != 0 ? "1px solid white" : "none", borderRadius: "5px", marginTop:"10px",padding: "10px"}}> */}
      {correctBlankAnswers.map((ele, index) => {
        return (
          <React.Fragment key={ele.key_id}>
            <label className="label-class">
              {props.isDisabled
                ? "Correct Answer for Blank " + (index + 1)
                : "Enter Correct Answer for Blank " + (index + 1)}
            </label>
            &nbsp;
            {!props.isDisabled && (
              <>
                <span>&nbsp;-&nbsp;</span>
                <select
                  id={"correct_answer_type_" + index}
                  className="answer-type-dropdown"
                  value={props.correctFIBAnswerTypes[index]}
                  // defaultValue={correctBlankAnswerTypes[index]}
                  onChange={(event) => setCorrectAnswerType(event)}
                >
                  <option value="value">Value</option>
                  <option value="formula">Formula</option>
                </select>
              </>
            )}
            <br />
            <input
              onChange={(event) => setCorrectAnswers(event)}
              // onBlur={(event) => checkExpression(event)}
              className="blanks-answer-field"
              id={"blank_answer_" + index}
              placeholder="Correct Answer"
              value={props.correctFIBAnswers[index]}
              // value={ele.answer}
              disabled={props.isDisabled}
            />
            <br />
          </React.Fragment>
        );
      })}
      {/* </div> */}
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

  .answer-type-dropdown {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    border: 1px solid #282c34;
    margin-top: 5px;
    border-radius: 5px;
    /* width: max-width; */
    /* height: 30px; */
    padding-left: 5px;
    /* padding-right: 10px; */
    /* text-align: end; */
  }

  .add-blank-button:hover {
    cursor: pointer;
  }

  button:disabled {
    background-color: gray;
    border: none;
  }

  textarea:disabled {
    color: white;
  }

  input:disabled {
    color: white;
  }
`;

export default FIBTemplate;
