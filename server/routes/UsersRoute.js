const router = require("express").Router();
const UsersModel = require("../Models/UsersModel");
const bcrypt = require("bcrypt");
const Users = require("../Models/UsersModel");
const jwt = require("jsonwebtoken");
const sendMail = require("../services/EmailService");

/*
Title: Create and Verify JWTs with Node.js
Author: Geeks For Geeks
Date: 16-Feb-2022
Source: https://www.geeksforgeeks.org/how-to-create-and-verify-jwts-with-node-js/
*/
const checkToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token is " + JSON.stringify(token));
  if (token) {
    jwt.verify(token, "thisistheloginsecretcode", (err, currentUser) => {
      if (err) res.json({ message: err });
      else {
        // console.log("Current user is: " + JSON.stringify(currentUser));
        req.user = {};
        req.user.first_name = currentUser.first_name;
        req.user.last_name = currentUser.last_name;
        req.user.email = currentUser.email;
        req.user.role = currentUser.role;
        req.user.uni_id = currentUser.uni_id;
        next();
      }
    });
  }
};

// router.get("/getUser", checkToken, (req, res) => {
//   console.log("get user hit");
//   res.json(req.user);
// });

router.post("/login", (req, res) => {
  const user = req.body;
  Users.findOne({ email: user.email }).then((userInDB) => {
    if (!userInDB) {
      res.json({ message: "Invalid User Name or Password!" });
    } else if (!userInDB.user_logged_in) {
      /*
Title: Hash and Verify a Password with bcrypt
Author: MARY GATHONI
Date: 16-May-2022
Source: https://www.makeuseof.com/nodejs-bcrypt-hash-verify-salt-password/
*/
      bcrypt.compare(user.password, userInDB.password).then((valid) => {
        if (valid) {
          const info = {
            first_name: userInDB.first_name,
            last_name: userInDB.last_name,
            email: userInDB.email,
            role: userInDB.role,
            uni_id: userInDB.uni_id,
          };

          UsersModel.updateOne(
            { email: user.email },
            { $set: { user_logged_in: true } },
            function (err, res) {
              if (err) throw res.json({ message: err });
            }
          );

          /*
Title: Create and Verify JWTs with Node.js
Author: Geeks For Geeks
Date: 16-Feb-2022
Source: https://www.geeksforgeeks.org/how-to-create-and-verify-jwts-with-node-js/
Details: This piece of code is used in multiple areas.
*/
          jwt.sign(
            info,
            "thisistheloginsecretcode",
            { expiresIn: "1h" },
            (err, token) => {
              if (err) res.json({ message: err });
              else {
                res.cookie("token", token, { httpOnly: true });
                res.json({
                  message: "success",
                  user_data: info,
                  token: "Bearer " + token,
                });
              }
            }
          );
        } else {
          res.json({ message: "Invalid User Name or Password!" });
        }
      });
    } else {
      res.json({
        message:
          "Your session is already active in other browser tabs.\n Please logout from existing sessions to login here.",
      });
    }
  });
});

router.post("/forgotPassword", async (req, res) => {
  const userEmail = req.body.email;
  // const userEmail = "lalithavasanth10@gmail.com";
  // console.log(userEmail);
  const user = await UsersModel.findOne({ email: userEmail });
  // console.log("User is "+ String(user._id));
  if (!user) {
    res.json({ message: "user not found" });
  } else {
    const info = {
      email: userEmail,
    };
    // const resetToken = await jwt.sign(
    jwt.sign(
      info,
      "thisisthepasswordresetsecretcode",
      { expiresIn: "10m" },
      (err, token) => {
        sendMail
          .passwordResetMail(userEmail, token)
          .then(
            UsersModel.updateOne(
              { email: userEmail },
              { $set: { resetPasswordToken: token } },
              function (err, res) {
                if (err) throw err;
              }
            )
          )
          .then(res.json({ message: "success" }))
          .catch((err) => console.log(err));
      }
    );
  }
});

router.post("/resetPassword", (req, res) => {
  let newPassword = req.body.password;
  const resetToken = req.body.resetToken;

  bcrypt
    .hash(newPassword, 10)
    .then((hash) => {
      newPassword = hash;
    })
    .then(() => {
      /*
Title: Create and Verify JWTs with Node.js
Author: Geeks For Geeks
Date: 16-Feb-2022
Source: https://www.geeksforgeeks.org/how-to-create-and-verify-jwts-with-node-js/
Details: This piece of code is used in multiple areas.
*/
      jwt.verify(resetToken, "thisisthepasswordresetsecretcode", (err) => {
        if (err) {
          res.json({ message: "link expired" });
          throw err;
        }
      });
    })
    .then(() => {
      UsersModel.updateOne(
        { resetPasswordToken: resetToken },
        { $set: { password: newPassword, resetPasswordToken: "" } },
        function (err) {
          if (err) return res.json({ message: err });
        }
      )
        .clone()
        .then(res.json({ message: "password reset successful" }));
    })
    .catch((err) => console.log(err));
});

router.post("/changePassword", async (req, res) => {
  console.log("reached change password");
  const { userEmail, currentPassword, newPassword } = req.body;
  const user = await UsersModel.findOne({ email: userEmail });
  if (user) {
    bcrypt.compare(currentPassword, user.password).then((valid) => {
      if (valid) {
        bcrypt.hash(newPassword, 10).then((hash) => {
          const finalNewPassword = hash;
          console.log("New Password: " + finalNewPassword);
          UsersModel.updateOne(
            { email: userEmail },
            { $set: { password: finalNewPassword } },
            function (err) {
              if (err) res.json({ message: err });
            }
          )
            .clone()
            .then(res.json({ message: "success" }));
        });
      } else {
        res.json({ message: "incorrect password" });
      }
    });
  } else {
    res.json({ message: "Operation failed! Please try again later!" });
  }
});

router.post("/signOut", (req, res) => {
  // console.log("email is: " + req.body.email);
  res.cookie("token", "");
  UsersModel.updateOne(
    { email: req.body.email },
    { $set: { user_logged_in: false } },
    function (err, result) {
      if (err) throw res.json({ message: err });
      res.json({ message: "success" });
    }
  );
});

router.post("/usersForModule", async (req, res) => {
  const { moduleCode } = req.body;
  const users = await UsersModel.find({
    assigned_modules: { $in: moduleCode },
  });
  if (users) {
    let moduleUsers = users;
    moduleUsers = moduleUsers.map((ele) => {
      return {
        first_name: ele.first_name,
        last_name: ele.last_name,
        email: ele.email,
        uni_id: ele.uni_id,
        role: ele.role,
      };
    });
    res.send(moduleUsers);
  }
});

router.post("/assignedModuleCodes", async (req, res) => {
  const user = await UsersModel.findOne({ uni_id: req.body.uni_id });
  if (user) {
    res.send(user.assigned_modules);
  }
});

router.post("/getUnassignedUsers", async (req, res) => {
  const { moduleCode } = req.body;
  const users = await UsersModel.find(
    {
      assigned_modules: { $nin: moduleCode },
    },
    { uni_id: true, _id: false }
  );
  if (users) {
    let moduleUsers = users;
    moduleUsers = moduleUsers.map((ele) => {
      return ele.uni_id;
    });
    res.send(moduleUsers);
  }
});

module.exports = router;
