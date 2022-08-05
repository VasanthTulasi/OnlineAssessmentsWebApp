import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import SingleSelect from "react-select";

function EssayTemplate(props) {
  const textAreaComponent = useRef(null);

  const saveEssayQuestion = (event) => {
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveEssayQuestion(questionId, event.target.value);
  };

  return (
    <Essay>
      <label className="label-class">
        {props.isDisabled ? "Question" : "Enter the Essay Question"}
      </label>
      <br />
      <textarea
        ref={textAreaComponent}
        id={"essay_text_area_" + props.indexVal}
        className="text-area"
        onChange={saveEssayQuestion}
        rows="3"
        defaultValue={props.questionText}
        disabled={props.isDisabled}
      />
    </Essay>
  );
}

const Essay = styled.div`
  margin-top: 10px;

  .label-class {
    display: inline-block;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 0;
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
    resize:none;
  }

  textarea:disabled {
    color: white;
  }
`;

export default EssayTemplate;
