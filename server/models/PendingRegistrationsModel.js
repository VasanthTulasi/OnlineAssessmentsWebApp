const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user_type: {
      type: String,
      required: true,
    },
    uni_id: {
      type: Number,
      required: false,
    },
    uni_email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { collection: "PendingRegistrations", versionKey: false }
);

const PendingRegistrations = mongoose.model("PendingRegistrations", schema);
module.exports = PendingRegistrations;
