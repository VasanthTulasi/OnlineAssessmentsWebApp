import styled from "styled-components";
import React, { useRef } from "react";
import CreatableSelect from "react-select/creatable";

function MCQTemplate(props) {
  const selectComponent = useRef(null);

  function formatCreateLabel(value) {
    return 'Add Option "' + value + '"';
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
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: "17px",
      fontWeight: 400,
      color: "#282c34",
      backgroundColor: state.isSelected ? "#61dafb" : "white",
      "&:hover": {
        backgroundColor: "rgba(189,197,209,.3)",
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "17px",
    }),
    multiValue: (provided) =>({
      ...provided,
      fontSize: "20px"
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      "&:hover": {
        backgroundColor: "#282c34",
        color: "white",
      },
    }),
  };

  const setMCQOptions = () => {
    console.log(selectComponent.current.props.id);
  };

  return (
    <MCQ>
      <label className="label-class" style={{marginTop: 0}}>Enter the Question</label>
      <br />
      <textarea className="text-area" onChange={() => {}} rows="3" />
      <label id={"question_id_" + props.templateId} className="label-class" >
        Enter Option(s)
      </label>
      <div style={{marginTop: "5px"}}>
      <CreatableSelect
        ref={selectComponent}
        styles={customStyles}
        placeholder="Please Type Here And Add Them"
        id={"options_id_" + props.templateId}
        onChange={setMCQOptions}
        isMulti
        formatCreateLabel={formatCreateLabel}
        noOptionsMessage={() => null}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
        }}
      />
      </div>
      {/* <button
        onClick={() => {
          console.log(selectComponent.current.props.id);
        }}
      >
        click
      </button> */}
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
  }
`;

export default MCQTemplate;

