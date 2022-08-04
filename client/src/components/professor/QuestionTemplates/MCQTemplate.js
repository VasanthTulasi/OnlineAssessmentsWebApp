import styled from "styled-components";
import React, { useState, useRef, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import SingleSelect from "react-select";

function MCQTemplate(props) {
  const [availableOptions, setAvailableOptions] = useState([]);
  const optionsComponent = useRef(null);
  const textAreaComponent = useRef(null);
  const correctOptionComponent = useRef(null);

  function formatCreateLabel(value) {
    return 'Add Option "' + value + '"';
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

  useEffect(() => {
    let options = props.options;
    options = options.map((ele) => {
      return { label: ele, value: ele };
    });
    setAvailableOptions(options);
  }, []);

  const saveMCQQuestion = (event) => {
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveMCQQuestion(questionId, event.target.value);
  };

  const saveMCQQuestionOptions = (selOptions) => {
    let optionsArray = selOptions;
    optionsArray = optionsArray.map((ele) => ele.value);
    setAvailableOptions(selOptions);
    const questionId = optionsComponent.current.props.id.split("_")[2];
    props.saveMCQQuestionOptions(questionId, optionsArray);
    if (
      !optionsArray.includes(correctOptionComponent.current.props.value.value)
    )
      props.saveMCQCorrectAnswer(questionId, "");
  };

  const saveMCQCorrectAnswer = (selOption) => {
    const questionId = correctOptionComponent.current.props.id.split("_")[2];
    props.saveMCQCorrectAnswer(questionId, selOption.value);
  };

  return (
    <MCQ>
      <label className="label-class" style={{ marginTop: 0 }}>
        {props.isDisabled ? "Question" : "Enter the MCQ Question"}
      </label>
      <br />
      <textarea
        ref={textAreaComponent}
        id={"mcq_text_area_" + props.indexVal}
        className="text-area"
        onBlur={saveMCQQuestion}
        rows="3"
        defaultValue={props.questionText}
        placeholder="MCQ Question"
        spellCheck="false"
        disabled={props.isDisabled}
      />
      <label className="label-class">
        {props.isDisabled ? "Options" : "Enter Options"}
      </label>
      <div style={{ marginTop: "5px" }}>
        <CreatableSelect
          isDisabled={props.isDisabled}
          ref={optionsComponent}
          styles={customStyles}
          placeholder="Please Type Here And Add Them"
          id={"options_id_" + props.indexVal}
          onChange={saveMCQQuestionOptions}
          isMulti
          formatCreateLabel={formatCreateLabel}
          noOptionsMessage={() => null}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          defaultValue={() => {
            let options = props.options;
            options = options.map((ele) => {
              return { label: ele, value: ele };
            });
            return options;
          }}
        />
      </div>
      <label className="label-class">
        {props.isDisabled ? "Correct Answer" : "Select the Correct Answer"}
      </label>
      <div style={{ marginTop: "5px" }}>
        <SingleSelect
          isDisabled={props.isDisabled}
          isSearchable={false}
          ref={correctOptionComponent}
          options={availableOptions}
          id={"correct_option_" + props.indexVal}
          styles={customStyles}
          placeholder="Correct Answer"
          onChange={saveMCQCorrectAnswer}
          noOptionsMessage={() => "This is not one of the added options"}
          defaultValue={() => {
            return {
              label: props.correctAnswer,
              value: props.correctAnswer,
            };
          }}
          components={
            props.isDisabled
              ? {
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                }
              : {}
          }
        />
      </div>
    </MCQ>
  );
}

const MCQ = styled.div`
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
    resize: none;
  }

  textarea:disabled {
    color: white;
  }
`;

export default MCQTemplate;
