const router = require("express").Router();
const PendingRegistrationsModel = require("../Models/PendingRegistrationsModel");
const UsersModel = require("../Models/UsersModel");
const bcrypt = require("bcrypt");
const sendMail = require("../services/EmailService");

router.route("/").post(async (req, res) => {
  const user = req.body;
  const alreadyRegistered = await UsersModel.findOne({ email: user.email });
  if (alreadyRegistered) {
    res.json({ message: "already registered" });
  } else {
    const alreadyPendingApproval = await PendingRegistrationsModel.findOne({
      email: user.email,
    });
    if (alreadyPendingApproval) {
      res.json({ message: "already pending approval" });
    } else {
      const userData = new PendingRegistrationsModel(user);
      userData.save().then(() => {
        res.status(200).json({ message: "success" });
      });
    }
  }
});

router.get("/listofpendingusers", async (req, res) => {
  const usersList = await PendingRegistrationsModel.find();
  if (usersList) res.send(usersList);
});

router.post("/approveregistration", (req, res) => {
  const user = req.body;
  const password = user.password;
  console.log(user);

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      user.password = hash;
      const approveUser = new UsersModel(user);
      approveUser.save().then(async () => {
        await PendingRegistrationsModel.deleteOne(
          { email: user.email },
          function (err) {
            if (err) throw err;
            sendMail.regApprovalMail(user.email);
            res.json({ message: "success" });
          }
        );
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/rejectregistration", async (req, res) => {
  const rejectUser = await PendingRegistrationsModel.find({
    email: req.body.email,
  });

  if (rejectUser.length !== 0) {
    await PendingRegistrationsModel.deleteOne(
      { email: rejectUser[0].email },
      function (err) {
        if (err) throw err;
        sendMail.regRejectionMail(req.body.email);
        res.json({ message: "success" });
      }
    ).clone();
  } else {
    res.json({ message: "User not found or already deleted." });
  }
});

module.exports = router;
