const router = require("express").Router();
const AssessmentsModel = require("../models/AssessmentsModel");

router.post("/saveNewExam", async (req, res) => {
  console.log(JSON.stringify(req.body));
  const assessment = new AssessmentsModel(req.body);
  assessment
    .save()
    .then(() => res.json({ message: "success" }))
    .catch((err) => res.json({ message: err }));
});

router.post("/assessmentsForModule", async (req, res) => {
  const assessments = await AssessmentsModel.find({
    module_code: req.body.moduleCode,
  });
  if (assessments) {
    // let assessmentList = assessments;
    // assessmentList = assessmentList.map((ele) => {
    //   return {
    //     _id: ele._id,
    //     title: ele.title,
    //     window_start_time: ele.window_start_time,
    //     window_end_time: ele.window_end_time
    //   };
    // });
    res.send(assessments);
  }
});


router.post("/deleteAssessmentFromModule", (req,res) =>{
    const {_id} = req.body;
    AssessmentsModel.deleteOne({_id: _id}, function (err) {
        if (err) return res.json({ message: err });
        res.json({ message: "success" });
      });
});


router.post("/assessmentsbyId", async (req, res) => {
  console.log("Reached");
  console.log(req.body._id);
  const assessments = await AssessmentsModel.find({
    _id: req.body._id
  });
  if (assessments) {
    res.send(assessments[0]);
  }
});



module.exports = router;
