import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import SingleSelect from "react-select";
import Axios from "axios";
import BodyImage from "../../../svgs/body_background.svg";
import MCQTemplate from "../QuestionTemplates/MCQTemplate";
import FIBTemplate from "../QuestionTemplates/FIBTemplate";
import EssayTemplate from "../QuestionTemplates/EssayTemplate";
import CodingTemplate from "../QuestionTemplates/CodingTemplate";
import QuestionTypeDropdown from "../QuestionTypeDropdown";
import { LoginContext } from "../../../contexts/LoginContext";
import { useNavigate, useLocation } from "react-router-dom";

function ReviewAssessment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { loggedInUserDetails } = useContext(LoginContext);
  const [moduleCodesFromDB, setModuleCodesFromDB] = useState([]);
  const [moduleCode, setModuleCode] = useState("");
  const [questions, setQuestions] = useState([]);
  const [nextKeyId, setNextKeyId] = useState(1);
  const [assessmentDurationNumberOptions, setAssessmentDurationNumberOptions] =
    useState([]);
  const [selectedDurationMeasure, setSelectedDurationMeasure] =
    useState("minutes");
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [selectedDurationNumber, setSelectedDurationNumber] = useState(10);
  const [windowStartTime, setWindowStartTime] = useState("");
  const [windowEndTime, setWindowEndTime] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [message, setMessage] = useState("");
  const selectedDurationNumberDiv = useRef(null);
  const [changedMeasure, setChangedMeasure] = useState(0);
  const editAssess = useRef(null);
  const errorMessageRef = useRef(null);
  const totalMarksRef = useRef(null);

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/users",
    crossDomain: true,
  });

  const axios2 = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/assessments",
    crossDomain: true,
  });
  // const resetComponent = () => {
  //   setQuestions([]);
  // };

  //Question Type Method
  const changeQuestionType = (index, val) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionType = val;
    modQuestionArr[index].questionText = "";
    // modQuestionArr[index].questionMarks = "";

    if (val === "mcq") {
      deletePropertiesExcept(
        [
          "id",
          "questionType",
          "questionText",
          "questionMarks",
          "options",
          "correctAnswer",
        ],
        modQuestionArr,
        index
      );
      modQuestionArr[index].options = [];
      modQuestionArr[index].correctAnswer = "";
    } else if (val === "fib") {
      deletePropertiesExcept(
        [
          "id",
          "questionType",
          "questionText",
          "questionMarks",
          "correctFIBAnswers",
          "correctFIBAnswerTypes",
        ],
        modQuestionArr,
        index
      );
      modQuestionArr[index].correctFIBAnswers = [];
      modQuestionArr[index].correctFIBAnswerTypes = [];
    } else if (val === "essay") {
      deletePropertiesExcept(
        [
          "id",
          "questionType",
          "questionMarks",
          "questionText",
          "essayWordLimit",
          "correctKeywords",
        ],
        modQuestionArr,
        index
      );
      modQuestionArr[index].correctKeywords = [];
      modQuestionArr[index].essayWordLimit = "";
    } else {
      deletePropertiesExcept(
        [
          "id",
          "questionType",
          "questionText",
          "questionMarks",
          "codingLanguage",
          "codingTemplate",
          "testCases",
        ],
        modQuestionArr,
        index
      );
      modQuestionArr[index].codingLanguage = "";
      modQuestionArr[index].codingTemplate = "";
      modQuestionArr[index].testCases = [];
    }

    setQuestions(modQuestionArr);
  };

  const deletePropertiesExcept = (exceptionVals, modQuestionArr, index) => {
    for (let val in modQuestionArr[index]) {
      if (!exceptionVals.includes(String(val))) {
        // console.log("deleting " + val);
        delete modQuestionArr[index][val];
      }
    }
  };

  //MCQ Methods
  const saveMCQQuestion = (index, question) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionText = question;
    setQuestions(modQuestionArr);
  };

  const saveMCQQuestionOptions = (index, options) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].options = options;
    setQuestions(modQuestionArr);
  };

  const saveMCQCorrectAnswer = (index, correctAnswer) => {
    // console.log("setting correct answer: " + correctAnswer);
    let modQuestionArr = [...questions];
    modQuestionArr[index].correctAnswer = correctAnswer;
    setQuestions(modQuestionArr);
  };

  //Essay Methods
  const saveEssayQuestion = (index, question) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionText = question;
    setQuestions(modQuestionArr);
  };

  const saveEssayWordLimit = (index, wordLimit) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].essayWordLimit = wordLimit;
    setQuestions(modQuestionArr);
  };

  const saveEssayCorrectKeywords = (index, correctKeywords) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].correctKeywords = correctKeywords;
    setQuestions(modQuestionArr);
  };

  //FIB Methods
  const saveFIBQuestion = (index, question) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionText = question;
    setQuestions(modQuestionArr);
  };

  // const saveFIBAnswers = (index, answerIndex, correctAnswer) => {
  //   console.log("triggered save fib");
  //   if (answerIndex == null && correctAnswer == null) {
  //     let modQuestionArr = [...questions];
  //     modQuestionArr[index].correctFIBAnswers.push("");
  //     setQuestions(modQuestionArr);
  //   } else {
  //     let modQuestionArr = [...questions];
  //     modQuestionArr[index].correctFIBAnswers[answerIndex] = correctAnswer;
  //     setQuestions(modQuestionArr);
  //   }
  // };

  const saveFIBAnswers = (index, answers) => {
    console.log("save fib index " + index + " answers " + answers);
    let modQuestionArr = [...questions];
    modQuestionArr[index].correctFIBAnswers = answers;
    setQuestions(modQuestionArr);
  };

  const saveFIBAnswerTypes = (index, answerTypes) => {
    // console.log("save fib index "+index+ " answers " +answers);
    let modQuestionArr = [...questions];
    modQuestionArr[index].correctFIBAnswerTypes = answerTypes;
    setQuestions(modQuestionArr);
  };

  const removeFIBAnswer = (index) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].correctFIBAnswers.splice(
      modQuestionArr[index].correctFIBAnswers.length - 1,
      1
    );
    setQuestions(modQuestionArr);
  };

  //Coding Methods
  const saveCodingQuestion = (index, question) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionText = question;
    setQuestions(modQuestionArr);
  };

  const saveCodingLanguage = (index, codingLanguage) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].codingLanguage = codingLanguage;
    setQuestions(modQuestionArr);
  };

  const saveCodingTemplate = (index, template) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].codingTemplate = template;
    setQuestions(modQuestionArr);
  };

  const saveCodingTestCases = (index, testCases) => {
    let modQuestionArr = [...questions];
    modQuestionArr[index].testCases = testCases;
    setQuestions(modQuestionArr);
  };

  //Save Marks
  const saveMarks = (event) => {
    const index = event.currentTarget.id.split("_")[2];
    const marks = event.currentTarget.value;
    let modQuestionArr = [...questions];
    modQuestionArr[index].questionMarks = parseInt(marks);
    setQuestions(modQuestionArr);
  };

  useEffect(() => {
    // console.log("Default use effect");
    axios
      .post("/assignedModuleCodes", { uni_id: loggedInUserDetails.uni_id })
      .then((res) => {
        let moduleCodes = res.data;
        moduleCodes = moduleCodes.map((ele) => {
          return { value: ele, label: ele };
        });
        setModuleCodesFromDB(moduleCodes);
      });

    axios2.post("/assessmentsbyId", { _id: state._id }).then((res) => {
      // console.log("Returned assessment is:" + JSON.stringify(res.data));
      const assessment = res.data;
      setAssessmentTitle(assessment.title);
      setSelectedDurationMeasure(assessment.duration_measure);
      setSelectedDurationNumber(assessment.duration_number);
      setWindowStartTime(assessment.window_start_time);
      setWindowEndTime(assessment.window_end_time);
      setTotalMarks(assessment.total_marks);
      setModuleCode(assessment.module_code);

      const finalQuestions = assessment.questions.map((ele, index) => {
        return { id: index, ...ele };
      });
      setQuestions(finalQuestions);
      setNextKeyId(finalQuestions.length);

      if (assessment.duration_measure === "minutes") {
        let newNumbers = [];
        for (let i = 10; i <= 59; i = i + 10) newNumbers.push(i);
        setAssessmentDurationNumberOptions(newNumbers);
      } else {
        let newNumbers = [];
        for (let i = 1; i <= 3; i = i + 0.5) newNumbers.push(i);
        setAssessmentDurationNumberOptions(newNumbers);
      }
    });
  }, []);

  const changeDurationMeasure = (event) => {
    setSelectedDurationMeasure(event.target.value);
    if (event.target.value === "minutes") {
      let newNumbers = [];
      for (let i = 10; i <= 59; i = i + 10) newNumbers.push(i);
      setAssessmentDurationNumberOptions(newNumbers);
      setChangedMeasure((prevCount) => prevCount + 1);
    } else {
      let newNumbers = [];
      for (let i = 1; i <= 3; i = i + 0.5) newNumbers.push(i);
      setAssessmentDurationNumberOptions(newNumbers);
      setChangedMeasure((prevCount) => prevCount + 1);
    }
  };

  useEffect(() => {
    console.log("Reached");
    setSelectedDurationNumber(assessmentDurationNumberOptions[0]);
    selectedDurationNumberDiv.current.value =
      assessmentDurationNumberOptions[0];
  }, [changedMeasure]);

  // useEffect(() => {
  //   const finalQuestions = questions.map((ele, index) => {
  //     return { id: index, ...ele };
  //   });
  //   setQuestionsWithIDs(finalQuestions);
  // }, [questions]);

  const moduleCodeSelected = (selOption) => {
    setModuleCode(selOption.value);
  };

  const addNewQuestion = () => {
    setQuestions((prevState) => [
      ...prevState,
      {
        id: nextKeyId,
        questionType: "mcq",
        questionText: "",
        options: [],
        correctAnswer: "",
        questionMarks: "",
      },
    ]);
    setNextKeyId((currentId) => currentId + 1);
    editAssess.current.style.paddingBottom = "0px";
  };

  const removeQuestion = (event) => {
    const index = event.currentTarget.id.split("_")[2];
    let modQuestionArray = [...questions];
    modQuestionArray.splice(index, 1);
    setQuestions(modQuestionArray);

    if (modQuestionArray.length == 0)
      editAssess.current.style.paddingBottom = "50px";
  };

  useEffect(() => {
    errorMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const save = () => {
    // console.log(state.title);
    // console.log(state.duration_number);
    // console.log(state.duration_measure);
    // console.log(state.window_start_time);
    // console.log(state.window_end_time);
    // console.log("\n" + JSON.stringify(state.questions));
    // console.log(state.module_code);

    // console.log("save: ");
    // console.log(JSON.stringify(questions));
    // console.log(assessmentTitle);
    // console.log(selectedDurationNumber);
    // console.log(selectedDurationMeasure);
    // console.log(windowStartTime);
    // console.log(windowEndTime);
    // console.log(moduleCode);
    // console.log(state._id);
    let errMessage = "";
    if (
      assessmentTitle === "" ||
      windowStartTime === "" ||
      windowEndTime === "" ||
      totalMarks == ""
    ) {
      // alert("Fields cannot be empty. All the fields must be filled.");
      errMessage +=
        "Fields cannot be empty. All the fields must be filled.\n\n";
    }
    if (windowStartTime <= getCurrentTime()) {
      errMessage +=
        "Assessment Window Start Time cannot be in the past. Please select a future time.\n\n";
    }
    if (windowEndTime <= windowStartTime) {
      errMessage +=
        "Assessment Window End Time cannot be same or earlier than the Start Time.\n\n";
    }
    if (errMessage !== "") {
      setMessage("Please resolve the following error(s):\n\n" + errMessage);
      totalMarksRef.current.style.display = "none";
      return;
    } else {
      setMessage("");
      totalMarksRef.current.style.display = "none";
    }

    let marksError = "";
    if (isNaN(totalMarks))
      marksError += "Total marks cannot be a non-numeric value.\n\n";

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].questionMarks == "")
        marksError +=
          "Error in question number " +
          (i + 1) +
          ". Marks cannot be empty.\n\n";
      else if (isNaN(questions[i].questionMarks))
        marksError +=
          "Error in question number " +
          (i + 1) +
          ". Marks cannot be non-numeric value.\n\n";
    }

    if (marksError != "") {
      setMessage(marksError);
      return;
    }

    let marksSum = 0;
    for (let i = 0; i < questions.length; i++) {
      marksSum += questions[i].questionMarks;
    }

    if (marksSum != totalMarks) {
      setMessage(
        "Total marks and the sum of the individual marks do not match. Do you want the total marks to be updated to match the sum?\n\n"
      );
      totalMarksRef.current.style.display = "block";
      return;
    }

    validateAndSave();
  };

  const validateAndSave = () => {
    if (validateQuestions() === true) {
      let assessment = {
        module_code: moduleCode,
        title: assessmentTitle,
        duration_number: selectedDurationNumber,
        duration_measure: selectedDurationMeasure,
        window_start_time: windowStartTime,
        window_end_time: windowEndTime,
        total_marks: totalMarks,
      };
      const questionsWithoutIDs = questions.map((ele) => {
        if (ele.questionType === "mcq")
          return {
            questionType: ele.questionType,
            questionText: ele.questionText,
            options: ele.options,
            correctAnswer: ele.correctAnswer,
            questionMarks: ele.questionMarks,
          };
        else if (ele.questionType === "fib")
          return {
            questionType: ele.questionType,
            questionText: ele.questionText,
            correctFIBAnswers: ele.correctFIBAnswers,
            correctFIBAnswerTypes: ele.correctFIBAnswerTypes,
            questionMarks: ele.questionMarks,
          };
        else if (ele.questionType === "coding")
          return {
            questionType: ele.questionType,
            questionText: ele.questionText,
            codingLanguage: ele.codingLanguage,
            codingTemplate: ele.codingTemplate,
            testCases: ele.testCases,
            questionMarks: ele.questionMarks,
          };
        else
          return {
            questionType: ele.questionType,
            questionText: ele.questionText,
            correctKeywords: ele.correctKeywords,
            questionMarks: ele.questionMarks,
            essayWordLimit: ele.essayWordLimit,
          };
      });
      assessment.questions = questionsWithoutIDs;
      console.log("Final: " + JSON.stringify(assessment));
      axios2
        .post("/updateAssessmentById", { _id: state._id, assessment })
        .then((res) => {
          if (res.data.message == "success") {
            setMessage("Assessment Edited Successfully!");
            totalMarksRef.current.style.display = "none";
            // resetComponent();
          } else {
            setMessage(
              "Server Error: Failed to create assessment. Please try again later!"
            );
            totalMarksRef.current.style.display = "none";
          }
        });
    }
  };

  const goBack = () => navigate("../viewAssessments");

  const getCurrentTime = () => {
    let date = new Date();
    /*
Title: Convert date into ISO string by considering time zone.
Author: Dustin Silk
Date: 06-Jun-2016
Source: https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset
Details: This piece of code is used in multiple files.
*/
    let finalDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    return finalDate;
  };

  const getDurationInSeconds = () => {
    return (
      selectedDurationNumber *
      (selectedDurationMeasure === "minutes" ? 60 : 60 * 60)
    );
  };

  const validateQuestions = () => {
    let errorMessageString = "";

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].questionText === "") {
        // alert(
        //   "Error in question number " + (i + 1) + ". Question cannot be empty."
        // );
        errorMessageString +=
          "Error in question number " +
          (i + 1) +
          ". Question cannot be empty.\n\n";
        // return false;
      }

      if (questions[i].questionType === "mcq") {
        if (questions[i].options.length < 2) {
          // alert(
          //   "Error in question number " +
          //     (i + 1) +
          //     ". There must atleast be two options for the question."
          // );
          errorMessageString +=
            "Error in question number " +
            (i + 1) +
            ". There must atleast be two options for the question.\n\n";
          // return false;
        }
        if (questions[i].correctAnswer === "") {
          // alert(
          //   "Error in question number " +
          //     (i + 1) +
          //     ". The correct answer selected for the question is invalid."
          // );
          errorMessageString +=
            "Error in question number " +
            (i + 1) +
            ". The correct answer selected for the question is invalid.\n\n";
          // return false;
        }
      }
      if (questions[i].questionType === "fib") {
        if (questions[i].correctFIBAnswers.length === 0) {
          // alert(
          //   "Error in question number " +
          //     (i + 1) +
          //     ". There must at least be one blank in the question."
          // );
          errorMessageString +=
            "Error in question number " +
            (i + 1) +
            ". There must at least be one blank in the question.\n\n";
          // return false;
        }

        for (let j = 0; j < questions[i].correctFIBAnswers.length; j++) {
          if (questions[i].correctFIBAnswers[j] === "") {
            // alert(
            //   "Error in question number " +
            //     (i + 1) +
            //     ". The correct answer for question " +
            //     (j + 1) +
            //     " cannot be empty."
            // );
            errorMessageString +=
              "Error in question number " +
              (i + 1) +
              ". The correct answer for question " +
              (j + 1) +
              " cannot be empty.\n\n";
            // return false;
          }

          if (questions[i].correctFIBAnswerTypes[j] === "formula") {
            const curText = questions[i].questionText;
            let randNumIndices = [];
            for (let k = 0; k < curText.length; k++) {
              let indexFound = curText.indexOf("*RandNum*", k);
              if (!randNumIndices.includes(indexFound))
                randNumIndices.push(indexFound);
            }
            randNumIndices.pop();
            let randNumReferences = "";
            for (let k = 0; k < randNumIndices.length; k++) {
              if (k === randNumIndices.length - 1)
                randNumReferences += "rand_" + (k + 1);
              else randNumReferences += "rand_" + (k + 1) + ", ";
            }
            let randNumReferencesArray = randNumReferences.split(", ");
            const enteredFormula = questions[i].correctFIBAnswers[j];
            const formulaArray = enteredFormula.split(" ");
            for (let k = 0; k < formulaArray.length; k++) {
              if (
                !isNaN(formulaArray[k]) ||
                formulaArray[k] === "+" ||
                formulaArray[k] === "-" ||
                formulaArray[k] === "*" ||
                formulaArray[k] === "/" ||
                formulaArray[k] === "%" ||
                formulaArray[k] === ")" ||
                formulaArray[k] === "("
              )
                continue;

              if (!randNumReferencesArray.includes(formulaArray[k])) {
                // alert(
                //   formulaArray[k] +
                //     " is an invalid reference in the formula in question number " +
                //     (i + 1) +
                //     " - blank " +
                //     (j + 1)
                // );
                errorMessageString +=
                  "Error in question number " +
                  (i + 1) +
                  " - Blank " +
                  (j + 1) +
                  ". '" +
                  formulaArray[k] +
                  "' is an invalid reference in the formula. \n\n";
                // return false;
              }
            }

            try {
              eval(enteredFormula);
            } catch (e) {
              if (
                !e.message.includes("is not defined") &&
                !e.message.includes("Invalid reference")
              ) {
                // alert(
                //   e.message +
                //     " in question number " +
                //     (i + 1) +
                //     " - blank " +
                //     (j + 1)
                // );
                errorMessageString +=
                  e.message +
                  " in question number " +
                  (i + 1) +
                  " - blank " +
                  (j + 1) +
                  "\n\n";
                // return false;
              }
            }
          }
        }
      }
      if (questions[i].questionType === "essay") {
        if (questions[i].essayWordLimit == "")
          errorMessageString +=
            "Error in question number " +
            (i + 1) +
            ". Word limit cannot be empty.\n\n";
        else if (isNaN(questions[i].essayWordLimit))
          errorMessageString +=
            "Error in question number " +
            (i + 1) +
            ". Word limit cannot be a non numeric value.\n\n";
      }
      if (questions[i].questionType === "coding") {
        if (questions[i].codingLanguage === "") {
          // alert(
          //   "Error in question number " +
          //     (i + 1) +
          //     ". Atleast one programming language must be selected."
          // );
          errorMessageString +=
            "Error in question number " +
            (i + 1) +
            ". Atleast one programming language must be selected.\n\n";
          // return false;
        }
      }
    }

    if (errorMessageString !== "") {
      setMessage(
        "Please resolve the following error(s):\n\n" + errorMessageString
      );
      totalMarksRef.current.style.display = "none";
      return false;
    } else {
      setMessage("");
      totalMarksRef.current.style.display = "none";
      return true;
    }
  };

  const updateTotalMarks = () => {
    let marksSum = 0;
    for (let i = 0; i < questions.length; i++) {
      if (isNaN(questions[i].questionMarks)) continue;
      marksSum += questions[i].questionMarks;
    }
    setTotalMarks(marksSum);
    setMessage("Updated total marks to match the sum of the individual marks.");
    totalMarksRef.current.style.display = "none";
  };

  const dontUpdateTotalMarks = () => {
    setMessage(
      "Please update total marks to match the sum of the individual marks."
    );
    totalMarksRef.current.style.display = "none";
  };

  const styleForDropdown1 = {
    container: (provided) => ({
      ...provided,
      width: "400px",
      height: "35px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      // width: "400px",
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
    <RevAssessment ref={editAssess}>
      <div className="pending-registrations-heading">View Assessment</div>
      <div className="assessment-info">
        <label className="assessment-info-label">Assessment Title</label>
        <input
          className="assessment-text-field"
          placeholder="Assessment Title"
          onChange={(e) => {
            setAssessmentTitle(e.target.value);
          }}
          value={assessmentTitle}
          disabled="true"
        />
        <label className="assessment-info-label">Assessment Duration</label>
        <div className="assessment-duration">
          <select
            className="assessment-duration-number"
            onChange={(e) => {
              setSelectedDurationNumber(e.target.value);
            }}
            value={selectedDurationNumber}
            ref={selectedDurationNumberDiv}
            disabled="true"
          >
            {assessmentDurationNumberOptions.map((e, index) => {
              return <option value={e}>{e}</option>;
            })}
          </select>
          <select
            className="assessment-duration-measure"
            onChange={(event) => changeDurationMeasure(event)}
            value={selectedDurationMeasure}
            // defaultValue={selectedDurationMeasure}
            disabled="true"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hour(s)</option>
          </select>
        </div>
        <label className="assessment-info-label">
          Assessment Window Start Time
        </label>
        <input
          type="datetime-local"
          min={String(new Date().toISOString().slice(0, 16))}
          className="assessment-text-field"
          //   placeholder="Assessment Title"
          onChange={(e) => {
            setWindowStartTime(e.target.value);
          }}
          // defaultValue={state.window_start_time}
          value={windowStartTime}
          disabled="true"
        />
        <label className="assessment-info-label">
          Assessment Window End Time
        </label>
        <input
          type="datetime-local"
          min={windowStartTime}
          className="assessment-text-field"
          //   placeholder="Assessment Title"
          onChange={(e) => {
            setWindowEndTime(e.target.value);
          }}
          //   value={windowEndTime}
          // defaultValue={state.window_end_time}
          value={windowEndTime}
          disabled="true"
        />
        <label className="assessment-info-label">Total Marks</label>
        <input
          className="assessment-text-field"
          placeholder="Total Marks"
          onChange={(e) => {
            setTotalMarks(e.target.value);
          }}
          value={totalMarks}
          disabled="true"
        />

        <label className="assessment-info-label">Module Code</label>
        <div className="select-module-dropdown">
          <SingleSelect
            isDisabled={true}
            options={moduleCodesFromDB}
            styles={styleForDropdown1}
            placeholder="Select or Search Module Code"
            onChange={moduleCodeSelected}
            noOptionsMessage={() => "This module is not assigned to you"}
            // defaultValue={{
            //   label: state.module_code,
            //   value: state.module_code,
            // }}
            value={{
              label: moduleCode,
              value: moduleCode,
            }}
            maxMenuHeight={160}
          />
          {/* </div> */}
        </div>
      </div>
      <div className="questions">
        {/* {moduleCode !== "" && ( */}
        <label className="assessment-info-label" style={{ width: "80%" }}>
          Edit or Add Questions
        </label>
        {/* )} */}
        {/* {moduleCode !== "" && */}
        {questions.map((ele, index) => {
          return (
            <div key={ele.id} id={ele.id} className="new-question">
              <div className="question-number">{index + 1}</div>
              <div className="question-content">
                <label className="assessment-info-label">
                  Select Question Type
                </label>
                <QuestionTypeDropdown
                  indexVal={index}
                  changeQuestionType={changeQuestionType}
                  questionType={ele.questionType}
                  isDisabled={true}
                />
                {ele.questionType === "mcq" && (
                  <MCQTemplate
                    indexVal={index}
                    saveMCQQuestion={saveMCQQuestion}
                    saveMCQQuestionOptions={saveMCQQuestionOptions}
                    saveMCQCorrectAnswer={saveMCQCorrectAnswer}
                    questionText={ele.questionText}
                    options={ele.options}
                    correctAnswer={ele.correctAnswer}
                    isDisabled={true}
                  />
                )}
                {ele.questionType === "fib" && (
                  <FIBTemplate
                    indexVal={index}
                    saveFIBQuestion={saveFIBQuestion}
                    saveFIBAnswers={saveFIBAnswers}
                    saveFIBAnswerTypes={saveFIBAnswerTypes}
                    removeFIBAnswer={removeFIBAnswer}
                    questionText={ele.questionText}
                    correctFIBAnswers={ele.correctFIBAnswers}
                    correctFIBAnswerTypes={ele.correctFIBAnswerTypes}
                    isDisabled={true}
                  />
                )}
                {ele.questionType === "essay" && (
                  <EssayTemplate
                    indexVal={index}
                    saveEssayQuestion={saveEssayQuestion}
                    saveEssayCorrectKeywords={saveEssayCorrectKeywords}
                    saveEssayWordLimit={saveEssayWordLimit}
                    questionText={ele.questionText}
                    correctKeywords={ele.correctKeywords} 
                    essayWordLimit={ele.essayWordLimit}
                    isDisabled={true}
                  />
                )}
                {ele.questionType === "coding" && (
                  <CodingTemplate
                    indexVal={index}
                    saveCodingQuestion={saveCodingQuestion}
                    saveCodingLanguage={saveCodingLanguage}
                    saveCodingTemplate={saveCodingTemplate}
                    saveCodingTestCases={saveCodingTestCases}
                    questionText={ele.questionText}
                    codingLanguage={ele.codingLanguage}
                    testCases={ele.testCases}
                    codingTemplate={ele.codingTemplate}
                    isDisabled={true}
                  />
                )}
                <div style={{ marginTop: "5px" }}>
                  <label className="assessment-info-label">
                    Marks for Correct Answer
                  </label>
                  <br />
                  <input
                    id={"question_marks_" + index}
                    className="assessment-text-field"
                    placeholder="Marks for Correct Answer"
                    onBlur={saveMarks}
                    defaultValue={ele.questionMarks}
                    disabled="true"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* {moduleCode !== "" && ( */}
      {message && (
        <div ref={errorMessageRef} className="error-message">
          {message}
        </div>
      )}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          display: "none",
          marginTop: "10px",
        }}
        ref={totalMarksRef}
      >
        <button
          className="total-marks-button"
          onClick={() => updateTotalMarks()}
        >
          Yes
        </button>
        <button
          className="total-marks-button"
          style={{ marginLeft: "50px" }}
          onClick={() => dontUpdateTotalMarks()}
        >
          No
        </button>
      </div>
      <div
        style={{
          textAlign: "center",
          width: "100%",
          backgroundColor: "#282c34",
          // bacgroundColor: "#f2cc8f",
          paddingTop: "10px",
          paddingBottom: "10px",
          // position: "fixed",
          // bottom: 0,
          // borderTop: "1px solid #f2cc8f"
        }}
      >
        <button className="new-question-button" onClick={goBack}>
          Go Back
        </button>
      </div>
      {/* )} */}
    </RevAssessment>
  );
}

const RevAssessment = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #282c34;
  /* background-image: url("${BodyImage}");
  background-repeat: repeat;
  background-size: auto; */
  color: white;
  padding-top: 72px;
  /* border: 1px solid red; */
  flex-direction: column;
  margin-top: 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
  /* background-color: #282c34; */
  /* padding-bottom: 200px; */

  .pending-registrations-heading {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 21px;
    /* border: 1px solid red; */
    vertical-align: middle;
    /* text-decoration: underline; */
    /* margin-top: 0px; */
    text-align: center;
  }

  .assessment-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    /* width:40%; */
    /* border:1px solid red; */
    /* width: 100%; */
    /* text-align: center; */
    /* display:table; */
    /* margin-left: calc(150% - var(--width)); */
  }

  .assessment-info-label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
  }

  .select-module-dropdown {
    /* border:1px solid red; */
    margin-top: 5px;
  }

  .assessment-duration {
    margin-top: 5px;
    width: 100%;
    display: flex;
    flex-direction: row;
    /* border: 1px solid red; */
  }

  .assessment-duration-number {
    height: 35px;
    border-radius: 5px;
    flex: 2;
    margin-right: 5px;
    padding-left: 5px;
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
  }

  select:disabled.assessment-duration-number {
    background-color: rgba(189, 197, 209, 0.5);
    color: white;
  }
  select:disabled.assessment-duration-measure {
    background-color: rgba(189, 197, 209, 0.5);
    color: white;
  }

  .assessment-duration-measure {
    height: 35px;
    border-radius: 5px;
    flex: 8;
    margin-left: 5px;
    padding-left: 5px;
    color: #282c34;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
  }

  .assessment-text-field {
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

  .questions {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    flex-direction: column;
    /* border: 1px solid red; */
    margin: 20px;
    margin-bottom: 0px;
    width: 100%;
    background-color: #282c34;
  }

  .new-question {
    border: 2px solid white;
    border-radius: 10px;
    margin-top: 30px;
    display: flex;
    width: 80%;
    justify-content: space-evenly;
    /* align-self: center; */
    align-items: center;
    background-color: #282c34;
  }

  /* .expand{
    width: 75%;
  } */

  .question-number {
    padding: 0px 20px 0px 20px;
    flex: 1;
    text-align: center;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 20px;
    font-weight: 400;
    margin-top: 20px;
  }
  .question-content {
    border-left: 1px solid white;
    padding: 15px 20px 15px 20px;
    /* border: 1px solid green; */
    flex: 12;
    /* text-align: center; */
  }

  .new-question-button {
    margin: 10px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 600;
    width: max-content;
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
    text-align: center;
  }

  .remove-question-button {
    margin-top: 25px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 600;
    width: max-content;
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
    text-align: center;
  }

  .remove-question-button:hover {
    cursor: pointer;
  }

  .new-question-button:hover {
    cursor: pointer;
  }

  .error-message {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
    border: 1px dotted white;
    border-radius: 8px;
    width: 80%;
    padding: 10px;
    white-space: pre-line;
    /* margin-left: 10px; */
    /* margin-right: 10px; */
  }

  .total-marks-button {
    margin-top: 5px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 600;
    width: max-content;
    border-radius: 25px;
    padding: 6px 10px 6px 10px;
    text-align: center;
  }

  .total-marks-button:hover {
    cursor: pointer;
  }
  input:disabled {
    color: white;
  }
`;

export default ReviewAssessment;
