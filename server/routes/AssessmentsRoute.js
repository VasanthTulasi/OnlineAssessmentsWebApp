const router = require("express").Router();
const AssessmentsModel = require("../models/AssessmentsModel");
const UsersModel = require("../Models/UsersModel");
const sendMail = require("../services/EmailService");

router.post("/saveNewAssessment", async (req, res) => {
  // console.log(JSON.stringify(req.body));
  const assessment = new AssessmentsModel(req.body);
  assessment
    .save()
    .then(async () => {
      res.json({ message: "Assessment saved successfully!" });
      // let studentEmails = [];
      // const students = await UsersModel.find(
      //   { role: "student" },
      //   { email: true, assigned_modules: true, _id: false }
      // );
      // for (let i = 0; i < students.length; i++) {
      //   if (students[i].assigned_modules.includes(req.body.module_code))
      //     studentEmails.push(students[i].email);
      // }

      // const assessmentInfoForEmail = {
      //   title: req.body.title,
      //   duration: req.body.duration_number + " " + req.body.duration_measure,
      //   module_code: req.body.module_code,
      //   window_start_time: new Date(req.body.window_start_time)
      //     .toString()
      //     .slice(0, 21),
      //   window_end_time: new Date(req.body.window_end_time)
      //     .toString()
      //     .slice(0, 21),
      //   total_marks: req.body.total_marks,
      // };
      // for (let i = 0; i < studentEmails.length; i++) {
      //   sendMail.assessmentScheduledEmail(
      //     studentEmails[i],
      //     assessmentInfoForEmail
      //   );
      // }
    })
    .catch((err) => res.json({ message: err }));
});

router.post("/updateAssessmentById", async (req, res) => {
  // console.log(req.body._id);
  // console.log(JSON.stringify(req.body.assessment));
  const assessments = await AssessmentsModel.replaceOne(
    {
      _id: req.body._id,
    },
    { ...req.body.assessment }
  )
    .then(() => res.json({ message: "Assessment Edited Successfully!" }))
    .catch((err) => res.json({ message: err }));
});

router.post("/assessmentsForModule", async (req, res) => {
  const assessments = await AssessmentsModel.find({
    module_code: req.body.moduleCode,
  });
  if (assessments) {
    res.send(assessments);
  }
});

router.post("/deleteAssessmentFromModule", (req, res) => {
  const { _id } = req.body;
  AssessmentsModel.deleteOne({ _id: _id }, function (err) {
    if (err) return res.json({ message: err });
    res.json({ message: "success" });
  });
});

router.post("/assessmentsbyId", async (req, res) => {
  const assessments = await AssessmentsModel.find({
    _id: req.body._id,
  });
  if (assessments) {
    res.send(assessments[0]);
  }
});

module.exports = router;
