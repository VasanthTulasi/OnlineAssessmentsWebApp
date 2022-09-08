import React, { useRef } from "react";
import SingleSelect from "react-select";

function QuestionTypeDropdown(props) {
  const questionTypeComponent = useRef(null);
  const questionTypesDropdown = [
    { label: "Multiple Choice Question", value: "mcq" },
    { label: "Fill-in-the-blank", value: "fib" },
    { label: "Essay", value: "essay" },
    { label: "Coding", value: "coding" },
  ];

  const questionTypePairs = {
    mcq: "Multiple Choice Question",
    fib: "Fill-in-the-blank",
    essay: "Essay",
    coding: "Coding",
  };

  const setQuestionType = (selOption) => {
    const questionId = questionTypeComponent.current.props.id.split("_")[2];
    props.changeQuestionType(questionId, selOption.value);
  };

  const styleForDropdown = {
    valueContainer: (provided, { isDisabled }) => ({
      ...provided,
      width: "400px",
      paddingLeft: "10px",
      color: "black",
      font: "17px",
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: "17px",
      fontWeight: 400,
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
    container: (provided) => ({
      ...provided,
      width: "400px",
      marginTop: "5px",
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
    <SingleSelect
      isDisabled={props.isDisabled}
      ref={questionTypeComponent}
      id={"question_type_" + props.indexVal}
      options={questionTypesDropdown}
      styles={styleForDropdown}
      onChange={setQuestionType}
      defaultValue={{
        label: questionTypePairs[props.questionType],
        value: props.questionType,
      }}
      noOptionsMessage={() => "Question Type Not Found"}
      components={
        props.isDisabled
          ? {
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }
          : {}
      }
    />
  );
}

export default QuestionTypeDropdown;
