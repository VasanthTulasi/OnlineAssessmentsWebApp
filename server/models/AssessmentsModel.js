const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    module_code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    window_start_time: {
      type: String,
      required: true,
    },
    window_end_time: {
      type: String,
      required: true,
    },
    questions: {
      type:Array,
      required: true,
    }    
  },
  { collection: "Assessments", versionKey: false }
);

const Assessments = mongoose.model("Assessments", schema);
module.exports = Assessments;
