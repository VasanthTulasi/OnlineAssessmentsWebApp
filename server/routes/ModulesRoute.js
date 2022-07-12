const router = require("express").Router();
const ModulesModel = require("../Models/ModulesModel");

router.get("/listofmodules", async (req, res) => {
  // console.log("reached");
  const modulesList = await ModulesModel.find();
  if (modulesList) res.send(modulesList);
});

router.post("/editModule", async (req, res) => {
  
  console.log(req.body.moduleCode);
  ModulesModel.updateOne(
    { module_code: req.body.moduleCode},
    {
      $set: {
        module_code: req.body.moduleCode,
        module_title: req.body.moduleTitle,
        module_year: req.body.moduleYear,
        module_semester: req.body.moduleSem,
      },
    },
    function (err) {
      if (err) res.json({ message: err });
      res.json({ message: "success" });
    }
  );
});

router.post("/addNewModule", async (req, res) => {
  const moduleData = {
    module_code: req.body.moduleCode,
    module_title: req.body.moduleTitle,
    module_year: req.body.moduleYear,
    module_semester: req.body.moduleSem,
  };
  const module = await ModulesModel.find({
    module_code: moduleData.module_code,
  });

  if (module.length > 0) {
    console.log(module);
    res.json({ message: "Module already exists! Please add a new module." });
  } else {
    const newModule = new ModulesModel(moduleData);
    newModule
      .save()
      .then(() => {
        res.json({ message: "success" });
      })
      .catch((err) => res.json({ message: err }));
  }
});

module.exports = router;
