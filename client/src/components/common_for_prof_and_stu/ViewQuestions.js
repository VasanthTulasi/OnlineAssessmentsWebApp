import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

function ViewQuestions() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const goBack = () => {
    navigate("../viewAssessments");
  };

  const viewDiscussions = (ind) => {
    navigate("../viewDiscussions", {
      state: {
        questionIndex: ind,
        assessmentId: state.assessment._id,
        question: state.assessment.questions[ind],
        assessment: state.assessment,
      },
    });
  };

  return (
    <ViewQues>
      <div className="heading">Discussion Questions</div>
      <div className="result-content">
        <label className="result-label">Assessment Title</label>
        <input
          className="result-text-field"
          disabled={true}
          value={state.assessment.title}
        />
        <span style={{ marginTop: "20px" }} />
        <label className="result-label">Questions</label>
        <div className="questions">
          <table className="module-data-content">
            <tbody>
              <tr>
                <td className="module-data start headers-color">S. No</td>
                <td className="module-data end headers-color">Questions</td>
              </tr>
              {state.assessment.questions.map((ele, index) => {
                return (
                  <tr>
                    <td className="module-data start">{index + 1}</td>
                    <td className="module-data end">
                      {ele.questionType === "fib"
                        ? ele.questionText.replaceAll(
                            "*RandNum*",
                            "a random number "
                          )
                        : ele.questionText}
                      {/* ele.questionText */}
                    </td>
                    <td>
                      <button
                        id={"viewDiscussions_" + index}
                        //   onClick={editModule}
                        //   disabled={
                        //     new Date() > new Date(ele.window_start_time)
                        //       ? true
                        //       : false
                        //   }
                        //   className={
                        //     new Date() > new Date(ele.window_start_time)
                        //       ? "module-data-button button-disabled"
                        //       : "module-data-button"

                        className="module-data-button"
                        onClick={() => viewDiscussions(index)}
                      >
                        View Discussions
                      </button>
                      {/* <button
                      id={"deleteButton_" + index}
                      onClick={deleteAssessment}
                      disabled={
                        new Date() > new Date(ele.window_start_time)
                          ? true
                          : false
                      }
                      className={
                        new Date() > new Date(ele.window_start_time)
                          ? "module-data-button button-disabled"
                          : "module-data-button"
                      }
                    >
                      Delete
                    </button> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button className="result-button" onClick={goBack}>
          Go Back
        </button>
      </div>
    </ViewQues>
  );
}

const ViewQues = styled.div`
  height: 100%;
  width: 100%;
  min-height: 100vh;
  background-color: #282c34;
  color: #61dafb;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 20px;
  flex-direction: column;
  overflow-y: auto;
  padding-top: 72px;

  .heading {
    margin-top: 30px;
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 20px;
  }

  .result-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    /* border: 1px solid red; */
    width: 100%;
    padding-left: 50px;
  }

  .result-label {
    color: white;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    margin-top: 20px;
    /* border:1px solid red; */
  }

  .result-text-field {
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

  .result-text-field:disabled {
    color: white;
    background-color: rgba(239, 239, 239, 0.3);
  }

  .result-text-div {
    font-family: "Source Sans Pro", sans-serif;
    font-size: 17px;
    font-weight: 400;
    background-color: rgba(239, 239, 239, 0.3);
    padding: 5px;
    padding-left: 8px;
    border-radius: 5px;
    color: white;
    width: 50%;
    resize: none;
  }

  .module-data-content {
    color: white;
    margin-top: 5px;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  .module-data {
    border: 1px solid white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 10px;
    background-color: #282c34;
  }

  .start {
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
  }

  .end {
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
  }

  .module-data-button {
    margin-left: 15px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 600;
    width: max-content;
    /* height: 45px; */
    /* letter-spacing: 1px; */
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
  }

  .button-disabled {
    background-color: gray;
  }

  .no-user-data {
    border: 1px solid white;
    font-family: "Source Sans Pro", sans-serif;
    font-weight: 400;
    font-size: 18px;
    padding: 15px;
    background-color: #282c34;
    border-radius: 15px;
    text-align: center;
  }

  .module-data-button {
    cursor: pointer;
  }

  .headers-color {
    color: #61dafb;
  }

  .questions {
    width: 100%;
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .result-button {
    margin-top: 50px;
    border: 1px solid black;
    color: #282c34;
    background-color: white;
    font-family: "Sourse Sans Pro ", sans-serif;
    font-size: 15px;
    font-weight: 600;
    width: max-content;
    /* height: 45px; */
    border-radius: 25px;
    padding: 7px 20px 7px 20px;
    align-self: center;
  }

  .result-button:hover {
    cursor: pointer;
  }
`;

export default ViewQuestions;
