const router = require("express").Router();
const PendingRegistrationsModel = require("../Models/PendingRegistrationsModel");
const bcrypt = require("bcrypt");

// router.route("/getSuperHeroes").get((req, res) => {
//     RegistrationPendingModel.find()
//     .then(supheroes => res.json(supheroes))
//     .catch(err => res.status(400).json(err));
// })

router.route("/newUser").post((req, res) => {
  const body = req.body;
  //Hasing password
  const userPassword = body.password;
  bcrypt
    .hash(userPassword, 10)
    .then((hash) => {
      body.password = hash;
      const newUser = new PendingRegistrationsModel(body);
      newUser.save().then((result) => {
        res
          .status(200)
          .json({ "Data Added Successfully": "Added successfully" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// router.route("/deleteSuperHero").get((req, res) => {
//     RegistrationPendingModel.deleteMany({"name": "fass"})
//     .then(result => res.status(200).json({'Deleted Successfully': ''}))
//     // .catch(err => res.status(400).json(err));
// })


module.exports = router;
