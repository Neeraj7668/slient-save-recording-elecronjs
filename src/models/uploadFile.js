const { model, Schema } = require("mongoose");

const newTaskSchema = new Schema({
  name: {
    type: String,
    default: "",
  },
  recordingFile: {
    type: String,
    default: "",
  },
});

module.exports = model("recording", newTaskSchema);
