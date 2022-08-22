const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    email: {  
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    uni_id: {
      type: String,
      required: true
    },
    resetPasswordToken: {
      type: String,
      required: false
    },
    assigned_modules:{
      type:Array,
      required: false
    }
  },
  { collection: "Users", versionKey: false }
);

const Users = mongoose.model("Users", schema);
module.exports = Users;
