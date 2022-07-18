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
    let assessmentList = assessments;
    assessmentList = assessmentList.map((ele) => {
      return {
        _id: ele._id,
        title: ele.title,
        window_start_time: ele.window_start_time
      };
    });
    res.send(assessmentList);
  }
});


router.post("/deleteAssessmentFromModule", (req,res) =>{
    const {_id} = req.body;
    // console.log("id is: "+_id);
    AssessmentsModel.deleteOne({_id: _id}, function (err) {
        if (err) return res.json({ message: err });
        res.json({ message: "success" });
      });
});



module.exports = router;
