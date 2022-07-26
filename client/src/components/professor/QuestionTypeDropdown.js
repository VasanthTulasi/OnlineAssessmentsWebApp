import React, { useRef } from "react";
import SingleSelect from "react-select";

function QuestionTypeDropdown(props) {
  const questionTypeComponent = useRef(null);
  const questionTypesDropdown = [
    { label: "Multiple Choice Question", value: "mcq" },
    { label: "Fill in the Blank", value: "fib" },
    { label: "Essay", value: "essay" },
    { label: "Coding", value: "coding" },
  ];
  const setQuestionType = (selOption) => {
    const questionId = questionTypeComponent.current.props.id.split("_")[2];
    props.changeQuestionType(questionId, selOption.value);
  };

  const customStyles = {
    valueContainer: (provided) => ({
      ...provided,
      width: "400px",
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
    container: (provided) => ({
      ...provided,
      width: "400px",
      marginTop: "5px",
    }),
  };

  return (
    <SingleSelect
      ref={questionTypeComponent}
      id={"question_type_" + props.indexVal}
      options={questionTypesDropdown}
      styles={customStyles}
      onChange={setQuestionType}
      defaultValue={() => {}}
      noOptionsMessage={() => "Question Type Not Found"}
    />
  );
}

export default QuestionTypeDropdown;
