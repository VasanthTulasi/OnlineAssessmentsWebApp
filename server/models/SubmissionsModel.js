const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    assessment_id: {
      type: String,
      required: true,
    },
    student_uni_id: {
      type: String,
      required: true,
    },
    session_details: {
      type: Object,
      required: false,
    },
    answers: {
      type: Array,
      required: true,
    },
  },
  { collection: "Submissions", versionKey: false }
);

const Submissions = mongoose.model("Submissions", schema);
module.exports = Submissions;
