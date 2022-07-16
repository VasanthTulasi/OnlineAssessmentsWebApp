import styled from "styled-components";
import React from "react";
import CreatableSelect from "react-select/creatable";

function MCQTemplate(props) {
  function formatCreateLabel(value) {
    return 'Add User "' + value + '"';
  }


  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "400px",
      // paddingLeft: "10px",
      color: "black",
      font: "17px",
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: "17px",
      fontWeight: 400,
      color: "#282c34",
      // border: "1px solid red"
    }),
    option: (provided, state) => ({
      ...provided,
      // ...state,
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
    multiValueRemove: (provided) => ({
      ...provided,
      "&:hover": {
        backgroundColor: "#282c34",
        color: "white",
      },
    }),
  };

  const setMCQOptions = (event) =>{
    // const id = event.currentTarget;
    console.log(event);
  }

  return (
    <MCQ>
      <label className="label">Enter The MCQ Question</label>
      <br />
      <textarea className="text-area" onChange={()=>{}} rows="3" />
      <label id={"question_id_"+props.templateId} className="label">Enter Option(s)</label>
      <CreatableSelect
        styles={customStyles}
        placeholder="Please Type Here And Add Them"
        id={"options_id_"+props.templateId}
        // onChange={(event) => props.enteredMCQOptions(event)}
        onChange={()=>{}}
        isMulti
        formatCreateLabel={formatCreateLabel}
        noOptionsMessage={() => null}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
      />
    </MCQ>
  );
}

const MCQ = styled.div`
  margin-top: 10px;
  .label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
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
`;

export default MCQTemplate;
