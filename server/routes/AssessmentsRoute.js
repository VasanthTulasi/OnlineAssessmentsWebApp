const router = require("express").Router();
const AssessmentsModel = require("../models/AssessmentsModel");

router.post("/saveNewExam", async (req,res) =>{
    console.log(JSON.stringify(req.body));
    const assessment = new AssessmentsModel(req.body);
    assessment.save().then(() => res.json({"message":"success"})).catch(err => res.json({"message":err}));
});


module.exports = router;
