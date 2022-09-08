import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import CreatableSelect from "react-select/creatable";

function EssayTemplate(props) {
  const textAreaComponent = useRef(null);
  const correctKeywordsComponent = useRef(null);
  const wordLimitComponent = useRef(null);

  const saveEssayQuestion = (event) => {
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveEssayQuestion(questionId, event.target.value);
  };

  const saveWordLimit = (event) => {
    const questionId = wordLimitComponent.current.id.split("_")[3];
    props.saveEssayWordLimit(questionId, event.target.value);
  };

  const saveEssayCorrectKeywords = (enteredKeywords) => {
    let correctKeywordsArray = enteredKeywords;
    correctKeywordsArray = correctKeywordsArray.map((ele) => ele.value);
    const questionId = correctKeywordsComponent.current.props.id.split("_")[2];
    props.saveEssayCorrectKeywords(questionId, correctKeywordsArray);
  };

  function formatCreateLabel(value) {
    return 'Add Keyword "' + value + '"';
  }

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
    singleValue: (provided, { isDisabled }) => ({
      ...provided,
      color: isDisabled ? "white" : "#282c34",
    }),
    multiValue: (provided, { isDisabled }) => ({
      ...provided,
      fontSize: "20px",
      backgroundColor: isDisabled
        ? "rgba(239, 239, 239,0.3)"
        : provided.backgroundColor,
    }),
    multiValueLabel: (provided, { isDisabled }) => ({
      ...provided,
      color: isDisabled ? "white" : "#282c34",
    }),
    multiValueRemove: (provided, { isDisabled }) => ({
      ...provided,
      display: isDisabled ? "none" : provided.display,
      "&:hover": {
        backgroundColor: "#282c34",
        color: "white",
      },
    }),
    control: (provided, { isDisabled }) => ({
      ...provided,
      backgroundColor: isDisabled ? "rgba(239, 239, 239, 0.3)" : "white",
      border: isDisabled ? "none" : "1px solid white",
    }),
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
      <label className="label-class">
        {props.isDisabled ? "Word Limit" : "Enter Word Limit"}
      </label>
      <br />
      <input
        ref={wordLimitComponent}
        onChange={saveWordLimit}
        className="blanks-answer-field"
        id={"essay_word_limit_" + props.indexVal}
        placeholder="Word Limit"
        defaultValue={props.essayWordLimit}
        disabled={props.isDisabled}
      />
      <br />
      <label className="label-class" style={{ marginTop: "5px" }}>
        {props.isDisabled
          ? "Correct Answer Keywords"
          : "Enter Correct Answer Keywords"}
      </label>
      <div style={{ marginTop: "5px" }}>
        {
          // Title: Add multiple items in dropdown using React-select creatable dropdown
          // Author: React-select
          // Date: NA
          // Source: https://react-select.com/home
          // Details: This piece of code is used in multiple files.
        }
        <CreatableSelect
          isDisabled={props.isDisabled}
          ref={correctKeywordsComponent}
          styles={customStyles}
          placeholder="Please Type Here And Add Them"
          id={"keywords_id_" + props.indexVal}
          onChange={saveEssayCorrectKeywords}
          isMulti
          formatCreateLabel={formatCreateLabel}
          noOptionsMessage={() => null}
          components={{
            // Title: Remove dropdown indicator and the indicator separator from the dropdown
            // Author: Rajesh Kumar
            // Date: 07-Aug-2019
            // Source: https://stackoverflow.com/questions/54961077/react-select-is-there-a-way-to-remove-the-button-on-the-right-that-expand-the-l
            // Details: This piece of code is used in multiple files.
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          defaultValue={() => {
            let options = props.correctKeywords;
            options = options.map((ele) => {
              return { label: ele, value: ele };
            });
            return options;
          }}
        />
      </div>
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
    resize: none;
  }

  textarea:disabled {
    color: white;
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
`;

export default EssayTemplate;
