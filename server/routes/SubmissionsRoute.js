const router = require("express").Router();
const SubmissionsModel = require("../models/SubmissionsModel");

router.post("/saveAnswers", async (req, res) => {
  const { assessment_id, student_uni_id, index, answer } = req.body;
  SubmissionsModel.findOneAndUpdate(
    { assessment_id: assessment_id, student_uni_id: student_uni_id },
    { $set: { [`answers.${index}`] : answer }},
    function (err) {
      if (err) res.json({ message: err });
      res.json({ message: "success" });
    }
  );
});

router.post("/createNewSubmission", async (req, res) => {
  const { assessment_id, student_uni_id, numberOfQuestions } = req.body;
  let answerArr = Array(numberOfQuestions).fill("");

  //check if submission for this user already exists
  const submissionForUser = await SubmissionsModel.findOne({assessment_id: assessment_id,student_uni_id: student_uni_id});

  //save if submission does not exist
  if(!submissionForUser){
  const submission = new SubmissionsModel({assessment_id: assessment_id,student_uni_id: student_uni_id , answers: answerArr });
  submission
    .save()
    .then(() => res.json({ message: "success" }))
    .catch((err) => res.json({ message: err }));
  }else{
    res.json({message: "already exists"})
  }
});

module.exports = router;
