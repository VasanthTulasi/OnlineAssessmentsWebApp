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
    marks_awarded: {
      type: Array,
      required: false,
    },
    feedback: {
      type: String,
      required: false,
    },
    marks_released: {
      type: Boolean,
      required: false,
    },
    manually_evaluated: {
      type: Boolean,
      required: false,
    },
    auto_evaluated: {
      type: Boolean,
      required: false,
    },
  },
  { collection: "Submissions", versionKey: false }
);

const Submissions = mongoose.model("Submissions", schema);
module.exports = Submissions;
