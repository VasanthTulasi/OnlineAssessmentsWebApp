const router = require("express").Router();
const SubmissionsModel = require("../Models/SubmissionsModel");
const UsersModel = require("../Models/UsersModel");
const AssessmentsModel = require("../models/AssessmentsModel");

router.post("/saveAnswers", async (req, res) => {
  const { assessment_id, student_uni_id, index, answer } = req.body;
  SubmissionsModel.findOneAndUpdate(
    { assessment_id: assessment_id, student_uni_id: student_uni_id },
    { $set: { [`answers.${index}`]: answer } },
    function (err) {
      if (err) res.json({ message: err });
      else res.json({ message: "success" });
    }
  );
});

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
      console.log();
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

router.post("/saveMarksAwarded", (req, res) => {
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
        marksForCorrectAnswers.push(marks.questions[i].questionMarks);
      } else if (marks.questions[i].questionType === "fib") {
        correctAnswers.push(marks.questions[i].correctFIBAnswers);
        marksForCorrectAnswers.push(marks.questions[i].questionMarks);
      } else {
        correctAnswers.push("");
        marksForCorrectAnswers.push("");
      }
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
          let totalFIBCount = studentFIBAnswers.length;
          let correctFIBCount = 0;
          for (
            let k = 0;
            k < marks.questions[j].correctFIBAnswers.length;
            k++
          ) {
            if (
              marks.questions[j].correctFIBAnswers[k].toLowerCase() ===
              studentFIBAnswers[k].toLowerCase()
            ) {
              correctFIBCount++;
            }
          }
          const finalMarks =
            (correctFIBCount / totalFIBCount) * marksForCorrectAnswers[j];
          marksToBeAwarded.push(String(finalMarks));
        } else {
          if (submission.manually_evaluated === true)
            marksToBeAwarded.push(submission.marks_awarded[j]);
          else marksToBeAwarded.push("");
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
        marksForCorrectAnswers.push(marks.questions[i].questionMarks);
      } else if (marks.questions[i].questionType === "fib") {
        correctAnswers.push(marks.questions[i].correctFIBAnswers);
        marksForCorrectAnswers.push(marks.questions[i].questionMarks);
      } else {
        correctAnswers.push("");
        marksForCorrectAnswers.push("");
      }
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
            let totalFIBCount = studentFIBAnswers.length;
            let correctFIBCount = 0;
            for (
              let k = 0;
              k < marks.questions[j].correctFIBAnswers.length;
              k++
            ) {
              if (
                marks.questions[j].correctFIBAnswers[k] === studentFIBAnswers[k]
              ) {
                correctFIBCount++;
              }
            }
            const finalMarks =
              (correctFIBCount / totalFIBCount) * marksForCorrectAnswers[j];
            marksToBeAwarded.push(String(finalMarks));
          } else {
            if (submission.manually_evaluated === true)
              marksToBeAwarded.push(submission.marks_awarded[j]);
            else marksToBeAwarded.push("");
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

module.exports = router;
