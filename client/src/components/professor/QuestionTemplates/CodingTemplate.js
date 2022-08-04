import styled from "styled-components";
import React, { useRef } from "react";
import SingleSelect from "react-select";

function CodingTemplate(props) {
  const textAreaComponent = useRef(null);
  const codingLanguageComponent = useRef(null);

  const programmingLanguages = [
    { label: "Any", value: "Any" },
    { label: "Java", value: "Java" },
    { label: "Python", value: "Python" },
    { label: "C++", value: "C++" },
    { label: "C Language", value: "C Language" },
  ];

  const saveCodingQuestion = (event) => {
    const questionId = textAreaComponent.current.id.split("_")[3];
    props.saveCodingQuestion(questionId, event.target.value);
  };

  const saveCodingLanguage = (selOption) => {
    const questionId = codingLanguageComponent.current.props.id.split("_")[2];
    props.saveCodingLanguage(questionId, selOption.value);
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "400px",
      height: "35px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      paddingLeft: "10px",
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
      font: "17px",
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
    control: (provided, { isDisabled }) => ({
      ...provided,
      backgroundColor: isDisabled ? "rgba(239, 239, 239, 0.3)" : "white",
      border: isDisabled ? "none" : "1px solid white",
    }),
    singleValue: (provided, { isDisabled }) => ({
      ...provided,
      color: isDisabled ? "white" : "#282c34",
    }),
  };

  return (
    <Coding>
      <label className="label-class" style={{ marginTop: 0 }}>
        {props.isDisabled ? "Question" : "Enter the Coding Question"}
      </label>
      <br />
      <textarea
        ref={textAreaComponent}
        id={"coding_text_area_" + props.indexVal}
        className="text-area"
        onBlur={saveCodingQuestion}
        rows="3"
        defaultValue={props.questionText}
        disabled={props.isDisabled}
      />
      <label className="label-class">
        {props.isDisabled
          ? "Programming Language"
          : "Select the Programming Language"}
      </label>
      <div style={{ marginTop: "5px" }}>
        <SingleSelect
          isDisabled={props.isDisabled}
          ref={codingLanguageComponent}
          id={"coding_language_" + props.indexVal}
          options={programmingLanguages}
          styles={customStyles}
          placeholder="Select or Search the Programming Language"
          onChange={saveCodingLanguage}
          noOptionsMessage={() => "This programming language is not available"}
          defaultValue={{
            label: props.codingLanguage,
            value: props.codingLanguage,
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
    </Coding>
  );
}

const Coding = styled.div`
  margin-top: 10px;

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
  textarea:disabled {
    color: white;
  }
`;

export default CodingTemplate;
