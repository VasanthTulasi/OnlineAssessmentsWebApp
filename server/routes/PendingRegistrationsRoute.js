const router = require("express").Router();
const PendingRegistrationsModel = require("../Models/PendingRegistrationsModel");
const UsersModel = require("../Models/UsersModel");
const bcrypt = require("bcrypt");
const sendMail = require("../services/EmailService");
const jwt = require("jsonwebtoken");

router.route("/").post(async (req, res) => {
  const user = req.body;
  const password = user.password;
  const alreadyRegistered = await UsersModel.findOne({ email: user.email });
  if (alreadyRegistered) {
    res.json({ message: "already registered" });
  } else {
    const alreadyPendingApproval = await PendingRegistrationsModel.findOne({
      email: user.email
    });
    if (alreadyPendingApproval) {
      res.json({ message: "already pending approval" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          user.password = hash;
          const userData = new PendingRegistrationsModel(user);
          userData.save().then(() => {
            res.status(200).json({ message: "success" });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

router.get("/listofpendingusers", async (req, res) => {
  const usersList = await PendingRegistrationsModel.find({
    activationToken: null,
  });
  if (usersList) res.send(usersList);
});

router.post("/approveregistration", (req, res) => {
  const user = req.body;
  const info = {
    email: user.email,
  };

  jwt.sign(info, "accountactivationsecretcode", (err, token) => {
    if (err) res.json({ message: err });
    else {
      sendMail
        .regActivationMail(user.email, token)
        .then(
          PendingRegistrationsModel.updateOne(
            { email: user.email },
            { $set: { activationToken: token } },
            function (err, res) {
              if (err) throw err;
            }
          )
        )
        .then(res.json({ message: "success" }))
        .catch((err) => console.log(err));
    }
  });
});

router.post("/activateaccount", async (req, res) => {
  // console.log("now");
  const token = req.body.token;
  // jwt.verify(token, "accountactivationsecretcode", (err) => {
  //   if (err) {
  //     res.json({ message: "link expired" });
  //     throw err;
  //   }
  // });

  let user = await PendingRegistrationsModel.findOne({
    activationToken: token
  }).clone();
  if (!user) {
    res.json({ message: "user not found" });
  } else {
    const finalUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      role: user.role,
      uni_id: user.uni_id
    };

    console.log(finalUser);

    const activateUser = new UsersModel(finalUser);
    activateUser.save().then(async () => {
      await PendingRegistrationsModel.deleteOne(
        { email: user.email },
        function (err) {
          if (err) throw err;
          sendMail.regApprovalMail(user.email);
          res.json({message: "success"});
        }
      ).clone();
    });
  }
});

router.post("/rejectregistration", async (req, res) => {
  const rejectUser = await PendingRegistrationsModel.find({
    email: req.body.email
  });

  if (rejectUser.length !== 0) {
    await PendingRegistrationsModel.deleteOne(
      { email: rejectUser[0].email },
      function (err) {
        if (err) throw err;
        sendMail.regRejectionMail(req.body.email, req.body.rejectionReason);
        res.json({ message: "success" });
      }
    ).clone();
  } else {
    res.json({ message: "User not found or already deleted." });
  }
});

module.exports = router;
