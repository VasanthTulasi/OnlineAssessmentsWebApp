const router = require("express").Router();
const ModulesModel = require("../Models/ModulesModel");
const UsersModel = require("../Models/UsersModel");

router.get("/listofmodules", async (req, res) => {
  const modulesList = await ModulesModel.find();
  if (modulesList) res.send(modulesList);
});

router.post("/editModule", async (req, res) => {
  ModulesModel.updateOne(
    { module_code: req.body.moduleCode },
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

router.post("/deleteModule", (req, res) => {
  ModulesModel.deleteOne({ module_code: req.body.module_code },
    function (err) {
    if (err) res.json({ message: err });
    res.json({ message: "success" });
  });
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
    res.json({ message: "Module already exists! Please add a new module." });
  } 
  
  else {
    const newModule = new ModulesModel(moduleData);
    newModule
      .save()
      .then(() => {
        res.json({ message: "success" });
      })
      .catch((err) => res.json({ message: err }));
  }
});

router.get("/moduleCodes", async (req, res) => {
  console.log(req.params);
  let moduleCodes = [];
  const modules = await ModulesModel.find();
  if (modules) {
    modules.forEach((ele) => {
      moduleCodes.push(ele.module_code);
    });
    res.send(moduleCodes);
  }
});

router.post("/getModulesInfo", async (req, res) => {
  let { module_codes } = req.body;
  let modulesInfo = [];
  for (let i = 0; i < module_codes.length; i++) {
    const modules = await ModulesModel.findOne(
      {
        module_code: module_codes[i],
      },
      { module_code: true, module_title: true, _id: false }
    );
    if (modules) modulesInfo.push(modules);
  }
  console.log(modulesInfo);
  res.send(modulesInfo);
});

router.post("/assignUsers", async (req, res) => {
  const { moduleCode, newUsers } = req.body;
  for (let i = 0; i < newUsers.length; i++) {
    await UsersModel.updateOne(
      { uni_id: newUsers[i] },
      { $addToSet: { assigned_modules: { $each: [moduleCode] } } }
    );
  }

  res.json({ message: "success" });
});

router.post("/deleteUserFromModule", async (req, res) => {
  const { uni_id, module_code } = req.body;
  await UsersModel.updateOne(
    { uni_id: uni_id },
    { $pull: { assigned_modules: module_code } }
  )
    .then(() => res.json({ message: "success" }))
    .catch((err) => res.json({ message: err }));
});

module.exports = router;
