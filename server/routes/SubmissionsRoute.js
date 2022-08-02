const router = require("express").Router();
const SubmissionsModel = require("../models/SubmissionsModel");

router.post("/saveAnswers", async (req, res) => {
  const { assessment_id, student_uni_id, index, answer } = req.body;
  SubmissionsModel.findOneAndUpdate(
    { assessment_id: assessment_id, student_uni_id: student_uni_id },
    { $set: { [`answers.${index}`]: answer } },
    function (err) {
      if (err) res.json({ message: err });
      res.json({ message: "success" });
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
      res.json({ message: "success" });
    }
  );
});

module.exports = router;
