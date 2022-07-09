const router = require("express").Router();
const UsersModel = require("../Models/UsersModel");
const bcrypt = require("bcrypt");
const Users = require("../Models/UsersModel");
const jwt = require("jsonwebtoken");
const sendMail = require("../services/EmailService");

// const cookieParser = require('cookie-parser');
// router.use(cookieParser());

const checkToken = (req, res, next) => {
  // const token = req.headers["authorization"]?.split(" ")[1];
  // console.log("checkToken called");
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
      res.json({ message: "Invalid User Name or Password from find one" });
    } else {
      bcrypt.compare(user.password, userInDB.password).then((valid) => {
        if (valid) {
          const info = {
            first_name: userInDB.first_name,
            last_name: userInDB.last_name,
            email: userInDB.email,
            role: userInDB.role,
            uni_id: userInDB.uni_id,
          };

          jwt.sign(
            info,
            "thisistheloginsecretcode",
            { expiresIn: "1h" },
            (err, token) => {
              if (err) res.json({ message: err });
              else {
                res.cookie("token", token, { httpOnly: true });
                res.json({
                  message: "Success",
                  user_data: info,
                  token: "Bearer " + token,
                });
              }
            }
          );
        } else {
          res.json({ message: "Invalid User Name or Password" });
        }
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
        sendMail.passwordResetMail(userEmail, token)
          .then(
            UsersModel.updateOne(
              { email: userEmail },
              { $set: { resetPasswordToken: token } },
              function (err, res) {
                if (err) throw err;
              }
            )
          )
          .then(res.json({ message: "password reset email sent" }))
          .catch((err) => console.log(err));
      }
    );
  }
});

router.post("/resetPassword",  (req, res) => {
  let newPassword = req.body.password;
  const resetToken = req.body.resetToken;

  bcrypt
    .hash(newPassword, 10)
    .then((hash) => {
      newPassword = hash;
    })
    .then(() => {
      jwt.verify(resetToken, "thisisthepasswordresetsecretcode", (err) => {
        if (err) {
          res.json({ message: "link expired" });
          throw err;
        }
      });
    })
    .then( () => {
        UsersModel.updateOne(
        { resetPasswordToken: resetToken },
        { $set: { password: newPassword, resetPasswordToken: "" }},
        function (err) {
          if (err) return res.json({ message: err });
        }
      ).clone().then(res.json({ message: "password reset successful" }));
    })
    .catch((err) => console.log(err));
});

function stopExec(err) {
  return Promise.reject(err);
}

router.get("/signOut", (req, res) => {
  res.cookie("token", "");
  res.json({ message: "success" });
  // console.log("no error");
});

module.exports = router;
