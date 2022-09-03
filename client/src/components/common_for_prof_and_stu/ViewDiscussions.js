import React, { useState, useEffect, useRef, useContext} from "react";
import styled from "styled-components";
import FIBTemplate from "../professor/QuestionTemplates/FIBTemplate";
import MCQTemplate from "../professor/QuestionTemplates/MCQTemplate";
import EssayTemplate from "../professor/QuestionTemplates/EssayTemplate";
import CodingTemplate from "../professor/QuestionTemplates/CodingTemplate";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginContext } from "../../contexts/LoginContext";
import Axios from "axios";

function ViewDiscussions() {
  const { loggedInUserDetails } = useContext(LoginContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [discussions, setDiscussions] = useState([]);
  const [discussionsLoaded, setDiscussionsLoaded] = useState(false);
  const [responses, setResponses] = useState([]);
  const newDiscussion = useRef(null);
  const discussionResponse = useRef(null);

  const axios = Axios.create({
    withCredentials: true,
    baseURL: "http://localhost:3001/discussions",
    crossDomain: true,
  });

  useEffect(() => {
    axios
      .post("/getDiscussions", {
        assessment_id: state.assessmentId,
        question_index: state.questionIndex,
      })
      .then((res) => {
        console.log("res received");
        setDiscussions(res.data);
        setDiscussionsLoaded(true);
        setResponses(Array(res.data.length).fill(""));
      });
  }, []);

  const addNewDiscussion = () => {
    const discussionText = newDiscussion.current.value;
    if (discussionText === "") {
      alert("New discussion point cannot be empty!");
      return false;
    }
    // alert(discussionText);
    axios
      .post("/saveNewDiscussion", {
        discussion_point: discussionText,
        responses: [],
        assessment_id: state.assessmentId,
        question_index: state.questionIndex,
      })
      .then((res) => {
        // if (res.data.message === "success") {
        //   setDiscussions((prevState) => [
        //     ...prevState,
        //     {
        //       discussion_point: discussionText,
        //       responses: [],
        //     },
        //   ]);
        // } else {
        //   alert("Server Error! Please try again!");
        // }
      });
  };

  const saveResponse = (event, ind) => {
    const resp = [...responses];
    resp[ind] = event.target.value;
    setResponses([...resp]);
  };

  const addResponse = (ind) => {
    axios
      .post("/saveNewResponse", {
        user_name:
          loggedInUserDetails.first_name + "_" + loggedInUserDetails.last_name,
        user_response: responses[ind],
        assessment_id: state.assessmentId,
        question_index: state.questionIndex,
        discussion_index: ind,
      })
      .then((res) => {
        console.log("done");
      });
  };

  const goBack = () => {
    navigate("../viewQuestions", {
      state: { assessment: state.assessment },
    });
  };

  return (
    <ViewDis>
      <div className="heading">Selected Question</div>
      <span style={{ marginTop: "20px" }}></span>
      {state.question.questionType === "fib" && (
        <FIBTemplate
          indexVal={0}
          saveFIBQuestion={() => {}}
          saveFIBAnswers={() => {}}
          saveFIBAnswerTypes={() => {}}
          removeFIBAnswer={() => {}}
          questionText={state.question.questionText}
          correctFIBAnswers={state.question.correctFIBAnswers}
          correctFIBAnswerTypes={state.question.correctFIBAnswerTypes}
          isDisabled={true}
        />
      )}
      {state.question.questionType === "mcq" && (
        <MCQTemplate
          indexVal={0}
          saveMCQQuestion={() => {}}
          saveMCQQuestionOptions={() => {}}
          saveMCQCorrectAnswer={() => {}}
          questionText={state.question.questionText}
          options={state.question.options}
          correctAnswer={state.question.correctAnswer}
          isDisabled={true}
        />
      )}
      {state.question.questionType === "essay" && (
        <EssayTemplate
          indexVal={0}
          saveEssayQuestion={() => {}}
          saveEssayCorrectKeywords={() => {}}
          questionText={state.question.questionText}
          correctKeywords={state.question.correctKeywords}
          isDisabled={true}
        />
      )}
      {state.question.questionType === "coding" && (
        <CodingTemplate
          indexVal={0}
          saveCodingQuestion={() => {}}
          saveCodingLanguage={() => {}}
          saveCodingTemplate={() => {}}
          saveCodingTestCases={() => {}}
          questionText={state.question.questionText}
          codingLanguage={state.question.codingLanguage}
          testCases={state.question.testCases}
          codingTemplate={state.question.codingTemplate}
          isDisabled={true}
        />
      )}
      <div className="heading">Discussions</div>
      {discussionsLoaded &&
        discussions.map((ele, index) => {
          return (
            <div className="discussion">
              <div className="discussion_heading">
                <div>
                  <i>Discussion Point</i>
                </div>
                <div>{ele.discussion_point}</div>
              </div>

              {ele.responses.map((res_ele) => {
                return (
                  <div
                    className="discussion_heading"
                    style={{ paddingLeft: "40px" }}
                  >
                    <div>
                      <i>{res_ele.user_name}</i>
                    </div>
                    <div>{res_ele.user_response}</div>
                  </div>
                );
              })}

              <div>
                <textarea
                  className="text-area-dis"
                  ref={discussionResponse}
                  // id={"disRes" + index}
                  onBlur={(event) => saveResponse(event, index)}
                  rows="3"
                  placeholder="Enter your response here..."
                />
                <br />
                <button
                  className="new-response-button"
                  onClick={() => addResponse(index)}
                >
                  Add My Response
                </button>
              </div>
            </div>
          );
        })}
      {discussionsLoaded && discussions.length === 0 && (
        <div className="discussions-text">
          No Discussions for this Questions
        </div>
      )}
      <textarea
        ref={newDiscussion}
        className="text-area-new-dis"
        rows="3"
        placeholder="Enter a new discussion point here..."
      />
      <br />
      <button className="new-discussion-button" onClick={addNewDiscussion}>
        Submit
      </button>
      <div style={{ textAlign: "center", width: "100%", marginTop: "40px" }}>
        <button className="new-question-button" onClick={goBack}>
          Go Back
        </button>
      </div>
    </ViewDis>
  );
}

const ViewDis = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #282c34;
  color: #61dafb;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 20px;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 72px;
  padding-left: 40px;

  .heading {
    margin-top: 30px;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
  }

  .discussions-text {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
  }

  .new-question-button {
    margin: 20px;
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

  .new-question-button:hover {
    cursor: pointer;
  }

  .discussion {
    border: 2px solid white;
    border-radius: 10px;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 18px;
    font-weight: 400;
    margin-top: 50px;
    width: 90%;
    /* margin-right: 40px; */
  }

  .discussion_heading {
    padding: 20px;
    border-bottom: 1px solid white;
    border-radius: 10px;
  }
  .new-response-button {
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 13px;
    font-weight: 600;
    width: max-content;
    border-radius: 25px;
    padding: 5px 16px 5px 16px;
    text-align: center;
    margin: 20px;
    margin-top: 10px;
    margin-left: 40px;
  }

  .new-response-button:hover {
    cursor: pointer;
  }

  .text-area-dis {
    width: 40%;
    color: black;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-left: 40px;
    border-radius: 5px;
    margin-top: 20px;
    resize: none;
    padding: 5px;
  }

  .text-area-new-dis {
    width: 40%;
    color: black;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    border-radius: 5px;
    margin-top: 50px;
    resize: none;
    padding: 5px;
    /* border: 1px solid red; */
  }

  .new-discussion-button {
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 13px;
    font-weight: 600;
    width: max-content;
    border-radius: 25px;
    padding: 5px 16px 5px 16px;
    text-align: center;
  }

  .new-discussion-button {
    cursor: pointer;
  }
`;

export default ViewDiscussions;
