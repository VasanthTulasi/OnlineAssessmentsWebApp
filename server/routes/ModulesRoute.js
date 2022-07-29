const router = require("express").Router();
const ModulesModel = require("../Models/ModulesModel");
const UsersModel = require("../Models/UsersModel");

router.get("/listofmodules", async (req, res) => {
  // console.log("reached");
  const modulesList = await ModulesModel.find();
  if (modulesList) res.send(modulesList);
});

router.post("/editModule", async (req, res) => {
  console.log(req.body.moduleCode);
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
  ModulesModel.deleteOne({ module_code: req.body.module_code }, function (err) {
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

router.get("/moduleCodes", async (req, res) => {
  let moduleCodes = [];
  const modules = await ModulesModel.find();
  if (modules) {
    modules.forEach((ele) => {
      moduleCodes.push(ele.module_code);
    });
    res.send(moduleCodes);
  }
});

router.post("/assignUsers", async (req, res) => {
  const { moduleCode, newUsers } = req.body;
  let validUsers = [],
    invalidUsers = [];
  let user = null;

  for (let i = 0; i < newUsers.length; i++) {
    user = await UsersModel.findOne({ uni_id: newUsers[i] });
    if (user) validUsers.push(newUsers[i]);
    else invalidUsers.push(newUsers[i]);
  }

  for (let i = 0; i < validUsers.length; i++) {
    await UsersModel.updateOne(
      { uni_id: validUsers[i]},
      { $addToSet: { assigned_modules: { $each: [moduleCode] } } }
    );
  }
  res.json({ message: "success", invalidUsers: invalidUsers });
 
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
