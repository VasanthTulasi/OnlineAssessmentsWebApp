const router = require("express").Router();
const PendingRegistrationsModel = require("../Models/PendingRegistrationsModel");
const UsersModel = require("../Models/UsersModel");

router.route("/").post(async (req, res) => {
  // console.log("Request received");
  const user = req.body;
  // console.log("User enetered email: " + user.email);
  const alreadyRegistered = await UsersModel.findOne({ email: user.email });
  if (alreadyRegistered) {
    res.json({ "message": "already registered" });
  } else {
    const alreadyPendingApproval = await PendingRegistrationsModel.findOne({
      email: user.email
    });
    if (alreadyPendingApproval) {
      res.json({ "message": "already pending approval" });
    } else {
      const userData = new PendingRegistrationsModel(user);
      userData.save().then(() => {
        res.status(200).json({ "message": "success" });
      });
    }
  }
});


router.get("/pendingusers",async (req,res) =>{
  const users = await PendingRegistrationsModel.find();
  if(users)
  res.send(users);
})

module.exports = router;
