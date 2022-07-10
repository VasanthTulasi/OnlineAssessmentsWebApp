const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    uni_id: {
      type: String,
      required: true,
    },
    activationToken: {
      type: String,
      required: false
    }
  },
  { collection: "PendingRegistrations", versionKey: false }
);

const PendingRegistrations = mongoose.model("PendingRegistrations", schema);
module.exports = PendingRegistrations;
