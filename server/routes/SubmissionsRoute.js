const router = require("express").Router();
const SubmissionsModel = require("../Models/SubmissionsModel");
const UsersModel = require("../Models/UsersModel");

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
      res.json({ message: "success" });
    }
  );
});

router.post("/getSubmissionsForAssessment", async (req, res) => {
  const { assessment_id } = req.body;
  let userInfo = [];
  const submissions = await SubmissionsModel.find(
    { assessment_id: assessment_id },
    { student_uni_id: true, _id: false }
  );
  if (submissions.length !== 0) {
    for (let i = 0; i < submissions.length; i++) {
      const user = await UsersModel.findOne(
        { uni_id: submissions[i].student_uni_id },
        { assigned_modules: false, role:false, password:false,email: false }
      );
      if (user.length !== 0) userInfo.push(user);
    }
    console.log(userInfo);
    res.send(userInfo);
  } else {
    res.json({ message: "no submissions" });
  }
});

module.exports = router;
