const mongoose = require("mongoose");
const { Schema } = mongoose;

const activitySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  important: { type: Boolean, required: true },
  urgent: { type: Boolean, required: true },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Activity", activitySchema);
