import React, { useEffect, useState } from "react";
import styled from "styled-components";

function FIBTemplate(props) {
  const { question, questionIndex, totalQuestions } = props;
  const [randomNumsGenerated, setRandomNumsGenerated] = useState([]);

  const setAnswers = (event) => {
    const changedIndex = event.target.id.split("_")[2];
    const answer = event.target.value;
    props.saveFIBAnswers(questionIndex, answer, changedIndex);
  };

  const getFinalQuestionDiv = (idIndex) => {
    let quesTextArr = question.questionText.split(" ");
    quesTextArr = quesTextArr.map((ele) => {
      if (ele === "____________") {
        return (
          <>
            <input
              type="text"
              className="fib-answer-text-field"
              id={"fib_answer_" + idIndex++}
              onChange={setAnswers}
              placeholder={"Write Your Answer Here"}
            />
            &nbsp;
          </>
        );
      } else return ele.trim() + " ";
    });
    return quesTextArr;
  };

  useEffect(() => {
    if (randomNumsGenerated.length === 0) return;

    const finalQuestion = question.questionText;
    let finalCorrectAnswers = [];
    for (let i = 0; i < question.correctFIBAnswerTypes.length; i++) {
      if (question.correctFIBAnswerTypes[i] === "value")
        finalCorrectAnswers.push(question.correctFIBAnswers[i]);
      else {
        let formula = question.correctFIBAnswers[i].split(" ");
        formula = formula.map((ele) => {
          if (ele.includes("rand_")) {
            let index = ele.substring(5) - 1;
            return "randomNumsGenerated[" + index + "]";
          } else return ele;
        });
        formula = formula.join(" ");
        let x = eval(formula);
        finalCorrectAnswers.push(x);
      }
    }
    console.log("question: " + finalQuestion);
    console.log("final correct answers: " + finalCorrectAnswers);
  }, [randomNumsGenerated]);

  useEffect(() => {
    // console.log("correct answers " + question.correctFIBAnswers);
    // setRandomNumsGenerated([]);
    console.log("use effect in fib template");
    let quesTextArr = question.questionText.split(" ");
    let randNums = [];
    quesTextArr = quesTextArr.map((ele) => {
      if (ele.trim() === "*RandNum*") {
        let randomNum = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
        randNums.push(randomNum);
        return String(randomNum).trim();
      } else return ele.trim();
    });
    question.questionText = quesTextArr.join(" ");
    setRandomNumsGenerated([...randNums]);

    const numberOfBlanks =
      question.questionText.split("____________").length - 1;
    const emptyAnswersArray = [];
    for (let i = 0; i < numberOfBlanks; i++) emptyAnswersArray.push("");
    props.saveFIBAnswers(questionIndex, emptyAnswersArray);
  }, [questionIndex]);

  return (
    <FIBAnswer>
      <div className="question-number">
        Question {questionIndex + 1} / {totalQuestions}
      </div>
      <div className="question-text">
        {getFinalQuestionDiv(0).map((ele) => {
          return ele;
        })}
      </div>
    </FIBAnswer>
  );
}

const FIBAnswer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background: #61dafb;
  margin: 20px 40px 0 40px;

  .question-number {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 15px;
    padding-left: 20px;
    color: black;
    background: #61dafb;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: 1px solid #282c34;
  }

  .question-text {
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 20px;
    /* border-bottom: 1px solid #282c34; */
    border-top: 0;
    color: black;
    margin: 20px 0 20px 0;
    /* border: 1px solid red; */
  }

  .fib-answer-text-field {
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    border: 1px solid #282c34;
    margin-top: 5px;
    border-radius: 5px;
    width: auto;
    height: 35px;
    padding-left: 10px;
  }
`;

export default FIBTemplate;
