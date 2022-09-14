const router = require("express").Router();
const SubmissionsModel = require("../Models/SubmissionsModel");
const UsersModel = require("../Models/UsersModel");
const AssessmentsModel = require("../models/AssessmentsModel");
const axios = require("axios");

router.post("/saveAnswers", async (req, res) => {
  const { assessment_id, student_uni_id, index, answer, question_type } =
    req.body;

  SubmissionsModel.findOneAndUpdate(
    { assessment_id: assessment_id, student_uni_id: student_uni_id },
    { $set: { [`answers.${index}`]: answer } },
    function (err) {
      if (err) res.json({ message: err });
      else res.json({ message: "success" });
    }
  );

  if (question_type === "coding") {
    const finalAnswer = await executeCode(answer, req.body.test_cases);
    SubmissionsModel.findOneAndUpdate(
      { assessment_id: assessment_id, student_uni_id: student_uni_id },
      { $set: { [`answers.${index}`]: finalAnswer } },
      function (err) {
        if (err) console.log({ message: err });
        else console.log({ message: "success" });
      }
    );
  }
});

const executeCode = async (answer, testCases) => {
  const languages = {
    Java: "java",
    Python: "python3",
    "C++": "cpp",
    "C Language": "c",
  };
  let executionResults = [];
  for (let i = 0; i < testCases.length; i++) {
    const codeData = {
      script: answer[1],
      stdin: testCases[i].sample_input,
      language: languages[answer[0]],
      versionIndex: "0",
      clientId: "f5f596e9d23c787b9310a2b7ca2b3c16",
      clientSecret:
        "fa13f1033f262922f661ed2427911926ce21d69cf0b410002bba08b747564ce5",
    };

    let res = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      {
        ...codeData,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    executionResults.push(res.data.output);
  }

  let codeOutput = answer;
  codeOutput.push(executionResults);
  return codeOutput;
};

router.post("/createNewSubmission", async (req, res) => {
  const { assessment_id, student_uni_id, session_details, numberOfQuestions } =
    req.body;
  let answerArr = Array(numberOfQuestions).fill("");

  const submission = new SubmissionsModel({
    assessment_id: assessment_id,
    student_uni_id: student_uni_id,
    session_details: session_details,
    answers: answerArr,
  });

  submission
    .save()
    .then(() => res.json({ message: "success" }))
    .catch((err) => res.json({ message: err }));
});

router.post("/getSubmissionData", async (req, res) => {
  const { assessmentIds, student_uni_id } = req.body;
  const submissionData = Array(assessmentIds.length).fill("");
  let submissionForUser = null;
  for (let i = 0; i < assessmentIds.length; i++) {
    submissionForUser = await SubmissionsModel.findOne({
      assessment_id: assessmentIds[i],
      student_uni_id: student_uni_id,
    });
    if (submissionForUser) {
      submissionData[i] = submissionForUser;
    } else {
      submissionData[i] = "";
    }
  }
  res.send(submissionData);
});

router.post("/updateAttemptsLeft", (req, res) => {
  const { assessment_id, student_uni_id, attempts_left } = req.body;
  SubmissionsModel.findOneAndUpdate(
    { assessment_id: assessment_id, student_uni_id: student_uni_id },
    { $set: { "session_details.attempts_left": attempts_left } },
    function (err) {
      if (err) res.json({ message: err });
      res.json({ message: "success" });
    }
  );
});

router.post("/updateTimeLeft", (req, res) => {
  const { assessment_id, student_uni_id, time_left } = req.body;
  SubmissionsModel.findOneAndUpdate(
    { assessment_id: assessment_id, student_uni_id: student_uni_id },
    { $set: { "session_details.time_left": time_left } },
    function (err) {
      if (err) res.json({ message: err });
      else res.json({ message: "success" });
    }
  );
});

router.post("/updateLastAttemptedQuestion", (req, res) => {
  const { assessment_id, student_uni_id, last_attempted_question } = req.body;
  SubmissionsModel.findOneAndUpdate(
    { assessment_id: assessment_id, student_uni_id: student_uni_id },
    {
      $set: {
        "session_details.last_attempted_question": last_attempted_question,
      },
    },
    function (err) {
      if (err) res.json({ message: err });
      else res.json({ message: "success" });
    }
  );
});

router.post("/getSubmissionsForAssessment", async (req, res) => {
  const { assessment_id } = req.body;
  let userInfo = [];
  const submissions = await SubmissionsModel.find(
    { assessment_id: assessment_id },
    {
      student_uni_id: true,
      marks_awarded: true,
      marks_released: true,
      auto_evaluated: true,
      manually_evaluated: true,
      _id: false,
    }
  );

  console.log("Submission data is" + JSON.stringify(submissions));
  if (submissions.length !== 0) {
    for (let i = 0; i < submissions.length; i++) {
      let user = await UsersModel.findOne(
        { uni_id: submissions[i].student_uni_id },
        { first_name: true, last_name: true, uni_id: true, _id: false }
      );
      // if (submissions[i].marks_awarded !== undefined) {
      //   console.log("entered");
      //   user.marks_awarded = "hello";
      // }
      const finalUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        uni_id: user.uni_id,
        marks_awarded: submissions[i].marks_awarded,
        marks_released: submissions[i].marks_released,
        manually_evaluated: submissions[i].manually_evaluated,
        auto_evaluated: submissions[i].auto_evaluated,
      };

      // console.log(finalUser);
      if (user.length !== 0) userInfo.push(finalUser);
      // console.log(userInfo);
    }
    // console.log(userInfo);
    res.send(userInfo);
  } else {
    res.json({ message: "no submissions" });
  }
});

router.post("/getStudentAnswersAndMarks", async (req, res) => {
  const { assessment_id, student_uni_id } = req.body;
  const stuAnswersAndMarks = await SubmissionsModel.findOne(
    {
      assessment_id: assessment_id,
      student_uni_id: student_uni_id,
    },
    {
      answers: true,
      marks_awarded: true,
      auto_evaluated: true,
      manually_evaluated: true,
      feedback: true,
      _id: false,
    }
  );
  if (stuAnswersAndMarks) {
    // console.log(stuAnswersAndMarks.answers);
    // console.log(stuAnswersAndMarks.marks_awarded);
    res.send(stuAnswersAndMarks);
  }
});

router.post("/saveMarksAndFeedback", (req, res) => {
  const {
    assessment_id,
    student_uni_id,
    marks_awarded,
    feedback,
    marks_released,
    manually_evaluated,
  } = req.body;
  SubmissionsModel.findOneAndUpdate(
    { assessment_id: assessment_id, student_uni_id: student_uni_id },
    {
      $set: {
        marks_awarded: marks_awarded,
        feedback: feedback,
        marks_released: marks_released,
        manually_evaluated: manually_evaluated,
      },
    },
    function (err) {
      if (err) res.json({ message: err });
      res.json({ message: "success" });
    }
  );
});

router.post("/updateMarksReleased", (req, res) => {
  const { assessment_id, student_uni_id } = req.body;
  SubmissionsModel.findOneAndUpdate(
    { assessment_id: assessment_id, student_uni_id: student_uni_id },
    { $set: { marks_released: true } },
    function (err) {
      if (err) res.json({ message: err });
      res.json({ message: "success" });
    }
  );
});

router.post("/getAssessmentTimeLeft", async (req, res) => {
  const { assessment_id, student_uni_id } = req.body;
  const submission = await SubmissionsModel.findOne(
    {
      assessment_id: assessment_id,
      student_uni_id: student_uni_id,
    },
    { session_details: true, _id: false }
  );
  if (submission) {
    res.json({ time_left: submission.session_details.time_left });
  }
});

router.post("/getAssessmentAttemptsLeft", async (req, res) => {
  const { assessment_id, student_uni_id } = req.body;
  const submission = await SubmissionsModel.findOne(
    {
      assessment_id: assessment_id,
      student_uni_id: student_uni_id,
    },
    { session_details: true, _id: false }
  );
  if (submission) {
    res.json({ attempts_left: submission.session_details.attempts_left });
  }
});

router.post("/autoEvaluate", async (req, res) => {
  const { assessment_id, student_uni_id } = req.body;
  let correctAnswers = [];
  let marksForCorrectAnswers = [];
  const marks = await AssessmentsModel.findOne(
    { _id: assessment_id },
    { questions: true, _id: false }
  );

  if (marks) {
    for (let i = 0; i < marks.questions.length; i++) {
      if (marks.questions[i].questionType === "mcq") {
        correctAnswers.push(marks.questions[i].correctAnswer);
      } else if (marks.questions[i].questionType === "fib") {
        correctAnswers.push("");
      } else if (marks.questions[i].questionType === "essay") {
        correctAnswers.push(marks.questions[i].correctKeywords);
      } else if (marks.questions[i].questionType === "coding") {
        correctAnswers.push(marks.questions[i].testCases);
      }

      marksForCorrectAnswers.push(marks.questions[i].questionMarks);
    }

    const submission = await SubmissionsModel.findOne(
      { assessment_id: assessment_id, student_uni_id: student_uni_id },
      {
        answers: true,
        marks_awarded: true,
        manually_evaluated: true,
        _id: false,
      }
    );

    if (submission) {
      let marksToBeAwarded = [];
      for (let j = 0; j < submission.answers.length; j++) {
        if (marks.questions[j].questionType === "mcq") {
          if (correctAnswers[j] === submission.answers[j]) {
            marksToBeAwarded.push(String(marksForCorrectAnswers[j]));
          } else {
            marksToBeAwarded.push("0");
          }
        } else if (marks.questions[j].questionType === "fib") {
          const studentFIBAnswers = submission.answers[j];
          const finalCorrectFIBAnswers =
            submission.answers[j][submission.answers[j].length - 1]
              .final_correct_answers;
          let totalFIBCount = studentFIBAnswers.length - 1;
          let correctFIBCount = 0;
          for (let k = 0; k < finalCorrectFIBAnswers.length; k++) {
            if (
              String(finalCorrectFIBAnswers[k]).toLowerCase() ===
              String(studentFIBAnswers[k]).toLowerCase()
            ) {
              correctFIBCount++;
            }
          }
          const finalMarks =
            (correctFIBCount / totalFIBCount) * marksForCorrectAnswers[j];
          marksToBeAwarded.push(String(Math.floor(finalMarks)));
        } else if (marks.questions[j].questionType === "essay") {
          const studentEssayAnswer = submission.answers[j];
          let totalCorrectKeywordsCount = correctAnswers[j].length;

          if (totalCorrectKeywordsCount === 0) {
            if (submission.manually_evaluated === true)
              marksToBeAwarded.push(submission.marks_awarded[j]);
            else marksToBeAwarded.push("");
          } else {
            let studentCorrectKeywordsCount = 0;
            for (let k = 0; k < correctAnswers[j].length; k++) {
              if (
                studentEssayAnswer
                  .toLowerCase()
                  .includes(correctAnswers[j][k].toLowerCase())
              ) {
                studentCorrectKeywordsCount++;
              }
            }
            const finalMarks =
              (studentCorrectKeywordsCount / totalCorrectKeywordsCount) *
              marksForCorrectAnswers[j];
            marksToBeAwarded.push(String(Math.floor(finalMarks)));
          }
        } else if (marks.questions[j].questionType === "coding") {
          const studentCodeOutput = submission.answers[j][2];
          const expectedOutput = [];
          for (let k = 0; k < correctAnswers[j].length; k++) {
            expectedOutput.push(correctAnswers[j][k].expected_output);
          }
          // console.log("Student Code Results: " + studentCodeOutput);
          // console.log("Expected Results: " + expectedOutput);

          if (expectedOutput.length == 0) {
            if (submission.manually_evaluated === true)
              marksToBeAwarded.push(submission.marks_awarded[j]);
            else marksToBeAwarded.push("");
          } else {
            let correctOutputCount = 0;

            for (let k = 0; k < studentCodeOutput.length; k++) {
              studentCodeOutput[k].replace("\n", "");
              if (studentCodeOutput[k].trim() == expectedOutput[k].trim())
                correctOutputCount++;
            }

            const finalMarks =
              (correctOutputCount / expectedOutput.length) *
              marksForCorrectAnswers[j];
            marksToBeAwarded.push(String(Math.floor(finalMarks)));
          }
        }
      }

      SubmissionsModel.findOneAndUpdate(
        { assessment_id: assessment_id, student_uni_id: student_uni_id },
        {
          $set: {
            marks_awarded: marksToBeAwarded,
            auto_evaluated: true,
            marks_released: false,
          },
        }
      )
        .then(() => {})
        .catch((err) => console.log(err));
    }

    res.json({ message: "success" });
  }
});

router.post("/autoEvaluateAll", async (req, res) => {
  const { assessment_id, uni_ids } = req.body;
  let correctAnswers = [];
  let marksForCorrectAnswers = [];
  const marks = await AssessmentsModel.findOne(
    { _id: assessment_id },
    { questions: true, _id: false }
  );

  if (marks) {
    for (let i = 0; i < marks.questions.length; i++) {
      if (marks.questions[i].questionType === "mcq") {
        correctAnswers.push(marks.questions[i].correctAnswer);
      } else if (marks.questions[i].questionType === "fib") {
        correctAnswers.push("");
      } else if (marks.questions[i].questionType === "essay") {
        correctAnswers.push(marks.questions[i].correctKeywords);
      } else if (marks.questions[i].questionType === "coding") {
        correctAnswers.push(marks.questions[i].testCases);
      }

      marksForCorrectAnswers.push(marks.questions[i].questionMarks);
    }

    for (let i = 0; i < uni_ids.length; i++) {
      const submission = await SubmissionsModel.findOne(
        { assessment_id: assessment_id, student_uni_id: uni_ids[i] },
        {
          answers: true,
          marks_awarded: true,
          manually_evaluated: true,
          _id: false,
        }
      );
      if (submission) {
        let marksToBeAwarded = [];
        for (let j = 0; j < submission.answers.length; j++) {
          if (marks.questions[j].questionType === "mcq") {
            if (correctAnswers[j] === submission.answers[j]) {
              marksToBeAwarded.push(String(marksForCorrectAnswers[j]));
            } else {
              marksToBeAwarded.push("0");
            }
          } else if (marks.questions[j].questionType === "fib") {
            const studentFIBAnswers = submission.answers[j];
            const finalCorrectFIBAnswers =
              submission.answers[j][submission.answers[j].length - 1]
                .final_correct_answers;
            let totalFIBCount = studentFIBAnswers.length - 1;
            let correctFIBCount = 0;
            for (let k = 0; k < finalCorrectFIBAnswers.length; k++) {
              if (
                String(finalCorrectFIBAnswers[k]).toLowerCase() ===
                String(studentFIBAnswers[k]).toLowerCase()
              ) {
                correctFIBCount++;
              }
            }
            const finalMarks =
              (correctFIBCount / totalFIBCount) * marksForCorrectAnswers[j];
            marksToBeAwarded.push(String(Math.floor(finalMarks)));
          } else if (marks.questions[j].questionType === "essay") {
            const studentEssayAnswer = submission.answers[j];

            let totalCorrectKeywordsCount = correctAnswers[j].length;

            if (totalCorrectKeywordsCount === 0) {
              if (submission.manually_evaluated === true)
                marksToBeAwarded.push(submission.marks_awarded[j]);
              else marksToBeAwarded.push("");
            } else {
              let studentCorrectKeywordsCount = 0;
              for (let k = 0; k < correctAnswers[j].length; k++) {
                console.log("student essay answer: " + studentEssayAnswer);
                if (
                  studentEssayAnswer != null &&
                  studentEssayAnswer
                    .toLowerCase()
                    .includes(correctAnswers[j][k].toLowerCase())
                ) {
                  studentCorrectKeywordsCount++;
                }
              }
              const finalMarks =
                (studentCorrectKeywordsCount / totalCorrectKeywordsCount) *
                marksForCorrectAnswers[j];
              marksToBeAwarded.push(String(Math.floor(finalMarks)));
            }
          } else if (marks.questions[j].questionType === "coding") {
            const studentCodeOutput = submission.answers[j][2];
            const expectedOutput = [];
            for (let k = 0; k < correctAnswers[j].length; k++) {
              expectedOutput.push(correctAnswers[j][k].expected_output);
            }
            // console.log("Student Code Results: " + studentCodeOutput);
            // console.log("Expected Results: " + expectedOutput);
            if (expectedOutput.length == 0) {
              if (submission.manually_evaluated === true)
                marksToBeAwarded.push(submission.marks_awarded[j]);
              else marksToBeAwarded.push("");
            } else {
              let correctOutputCount = 0;

              for (let k = 0; k < studentCodeOutput.length; k++) {
                studentCodeOutput[k].replace("\n", "");
                if (studentCodeOutput[k].trim() == expectedOutput[k].trim())
                  correctOutputCount++;
              }

              const finalMarks =
                (correctOutputCount / expectedOutput.length) *
                marksForCorrectAnswers[j];
              marksToBeAwarded.push(String(Math.floor(finalMarks)));
            }
          }
        }

        SubmissionsModel.findOneAndUpdate(
          { assessment_id: assessment_id, student_uni_id: uni_ids[i] },
          {
            $set: {
              marks_awarded: marksToBeAwarded,
              auto_evaluated: true,
              marks_released: false,
            },
          }
        )
          .then(() => {})
          .catch((err) => console.log(err));
      }
    }
    res.json({ message: "success" });
  }
});

router.post("/getOverallPercentages", async (req, res) => {
  const { module_codes, uni_id } = req.body;
  let finalMarks = [];
  for (let i = 0; i < module_codes.length; i++) {
    let assessments = await AssessmentsModel.find(
      { module_code: module_codes[i] },
      { _id: true, total_marks: true }
    );
    if (assessments) {
      let combinedAwardedMarks = 0;
      let combinedTotalMarks = 0;
      for (let j = 0; j < assessments.length; j++) {
        let marks = await SubmissionsModel.findOne(
          { assessment_id: assessments[j]._id, student_uni_id: uni_id },
          { marks_awarded: true }
        );
        if (marks) {
          let marksAssigned = marks.marks_awarded;
          if (marksAssigned.length != 0) {
            let awardedMarks = 0;
            for (let k = 0; k < marksAssigned.length; k++) {
              awardedMarks += parseInt(marks.marks_awarded[k]);
            }
            combinedAwardedMarks += awardedMarks;
            combinedTotalMarks += assessments[j].total_marks;
          }
        }
      }
      const percentage = (combinedAwardedMarks / combinedTotalMarks) * 100;
      finalMarks.push(Math.ceil(percentage));
    }
  }
  res.json(finalMarks);
  // console.log(finalMarks);
});

module.exports = router;
