import styled from "styled-components";
import React, { useState, useEffect, useRef } from "react";
import SingleSelect from "react-select";

function CodingTemplate(props) {
  const codingQuestionComponent = useRef(null);
  const codingLanguageComponent = useRef(null);
  const codingTemplateComponent = useRef(null);
  const [testCases, setTestCases] = useState([]);
  const [nextKey, setNextKey] = useState(null);

  useEffect(() => {
    let testCasesWithKeys = props.testCases;
    testCasesWithKeys.map((ele, ind) => {
      return { key_id: ind, ...ele };
    });

    setTestCases(testCasesWithKeys);
    setNextKey(testCasesWithKeys.length);
  }, []);

  const programmingLanguages = [
    // { label: "Any", value: "Any" },
    { label: "Java", value: "Java" },
    { label: "Python", value: "Python" },
    { label: "C++", value: "C++" },
    { label: "C Language", value: "C Language" },
  ];

  const codeTemplates = [
    "import java.util.Scanner;\npublic class AssessOnline {\n\tpublic static void main(String[] args){\n\t\tScanner sc = new Scanner(System.in);\n\t\tsc.close();\n\t\tanswer();\n\t} \n\tpublic static void answer(){\n\t\t//Your Code Here\n\t}\n}",
    "def answer():\n\t#Your Answer Here\n\nanswer();",
    "#include <iostream>\n\nusing namespace std;\n\nvoid answer(){\n\t//Your Answer Here\n}\n\nint main() {\n\tanswer();\n}",
    "#include <stdio.h>\n\nvoid answer(){\n\t//Your Answer Here\n}\n\nint main() {\n\tanswer();\n}",
  ];

  const saveCodingQuestion = (event) => {
    const questionId = codingQuestionComponent.current.id.split("_")[3];
    props.saveCodingQuestion(questionId, event.target.value);
  };

  const saveCodingLanguage = (selOption) => {
    const questionId = codingLanguageComponent.current.props.id.split("_")[2];
    props.saveCodingLanguage(questionId, selOption.value);
    updateCodingTemplate(selOption.value);
    saveCodingTemplate();
  };

  const updateCodingTemplate = (selLanguage) => {
    switch (selLanguage) {
      case "Java":
        codingTemplateComponent.current.value = codeTemplates[0];
        break;
      case "Python":
        codingTemplateComponent.current.value = codeTemplates[1];
        break;
      case "C++":
        codingTemplateComponent.current.value = codeTemplates[2];
        break;
      case "C Language":
        codingTemplateComponent.current.value = codeTemplates[3];
        break;
    }
  };

  const saveCodingTemplate = () => {
    const questionId = codingTemplateComponent.current.id.split("_")[2];
    props.saveCodingTemplate(questionId, codingTemplateComponent.current.value);
  };

  const checkTabPressInTemplate = (event) => {
    if (event.code === "Tab") {
      event.preventDefault();

      codingTemplateComponent.current.setRangeText(
        "\t",
        codingTemplateComponent.current.selectionStart,
        codingTemplateComponent.current.selectionStart,
        "end"
      );
    }
  };

  const addTestCase = () => {
    setTestCases((prevState) => [
      ...prevState,
      {
        key_id: nextKey,
        sample_input: "another input",
        expected_output: "another output",
      },
    ]);
    setNextKey((curVal) => curVal + 1);
  };

  const removeTestCase = (event) => {
    const index = event.currentTarget.id.split("_")[3];
    let modTestCasesArray = [...testCases];
    modTestCasesArray.splice(index, 1);
    setTestCases(modTestCasesArray);
  };

  const saveTestCases = (event) => {
    const index = event.target.id.split("_")[2];
    const type = event.target.id.split("_")[0];
    if (type === "sample") {
      let modTestCases = [...testCases];
      modTestCases[index].sample_input = event.target.value;
      setTestCases(modTestCases);
    } else {
      let modTestCases = [...testCases];
      modTestCases[index].expected_output = event.target.value;
      setTestCases(modTestCases);
    }
  };

  useEffect(() => {
    const questionId = codingQuestionComponent.current.id.split("_")[3];
    const testCasesWithoutKeys = testCases.map((ele) => {
      return {
        sample_input: ele.sample_input,
        expected_output: ele.expected_output,
      };
    });

    props.saveCodingTestCases(questionId, testCasesWithoutKeys);
  }, [testCases]);

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
        ref={codingQuestionComponent}
        id={"coding_text_area_" + props.indexVal}
        className="text-area"
        onBlur={saveCodingQuestion}
        rows="3"
        defaultValue={props.questionText}
        disabled={props.isDisabled}
        placeholder="Coding Question"
        spellCheck={"false"}
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
      {!props.isDisabled && (
        <>
          <label className="label-class" style={{ marginTop: "10px" }}>
            Enter Code Template"
          </label>
          <br />
        </>
      )}
      {!props.isDisabled && (
        <textarea
          ref={codingTemplateComponent}
          id={"coding_template_" + props.indexVal}
          className="template-text-area"
          onBlur={saveCodingTemplate}
          rows="10"
          disabled={props.isDisabled}
          onKeyDown={checkTabPressInTemplate}
          placeholder="Code Template for Students"
          defaultValue={props.codingTemplate}
          spellCheck="false"
        />
      )}
      {!props.isDisabled && <label className="label-class">Test Cases</label>}
      {!props.isDisabled && (
        <table className="test-cases-table">
          <tbody>
            {testCases.length != 0 && (
              <tr>
                <td>
                  <label className="label-class">Sample Input</label>
                </td>
                <td>
                  <label className="label-class" style={{ marginLeft: "10px" }}>
                    Expected Output
                  </label>
                </td>
              </tr>
            )}
            {testCases.map((ele, index) => {
              return (
                <React.Fragment key={ele.key_id}>
                  <tr>
                    <td>
                      <textarea
                        onBlur={(event) => saveTestCases(event)}
                        className="text-area"
                        id={"sample_input_" + index}
                        placeholder={"Enter Sample Input " + (index + 1)}
                        defaultValue={
                          props.testCases[index] !== undefined
                            ? props.testCases[index].sample_input
                            : null
                        }
                        disabled={props.isDisabled}
                        rows="2"
                      />
                    </td>
                    <td>
                      <textarea
                        onBlur={(event) => saveTestCases(event)}
                        className="text-area"
                        id={"expected_output_" + index}
                        placeholder={"Enter Expected Output " + (index + 1)}
                        defaultValue={
                          props.testCases[index] != undefined
                            ? props.testCases[index].expected_output
                            : null
                        }
                        disabled={props.isDisabled}
                        rows="2"
                        style={{ marginLeft: "10px" }}
                      />
                    </td>
                    <td>
                      <button
                        id={"remove_test_case_" + index}
                        className="module-data-button"
                        onClick={removeTestCase}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
            <tr>
              <td colSpan="2">
                <div style={{ textAlign: "center" }}>
                  <button
                    className="module-data-button"
                    onClick={addTestCase}
                    style={{ marginLeft: "0px" }}
                  >
                    Add a Test Case
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
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
    resize: none;
  }
  textarea:disabled {
    color: white;
  }

  .template-text-area {
    width: 100%;
    color: black;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    padding: 10px;
    border-radius: 5px;
    margin-top: 5px;
    resize: none;
  }

  .test-cases-table {
    border: 1px dotted white;
    margin-top: 5px;
    padding: 10px;
    border-radius: 5px;
  }

  .module-data-button {
    margin-left: 20px;
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

  .module-data-button:hover {
    cursor: pointer;
  }
`;

export default CodingTemplate;
