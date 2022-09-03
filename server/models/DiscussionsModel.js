const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    assessment_id: {
      type: String,
      required: true,
    },
    discussions: {
      type: Array,
      required: false,
    },
  },
  { collection: "Discussions", versionKey: false }
);

const Discussions = mongoose.model("Discussions", schema);
module.exports = Discussions;
