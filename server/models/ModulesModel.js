const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    module_code: {
      type: String,
      required: true
    },
    module_title: {
      type: String,
      required: true
    },
    module_year: {
      type: String,
      required: true
    },
    module_semester: {
      type: String,
      required: true
    },
    assigned_users:{
      type: Array,
      required:false
    }
  },
  { collection: "Modules", versionKey: false }
);

const Modules = mongoose.model("Modules", schema);
module.exports = Modules;
