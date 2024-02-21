const mongoose = require("mongoose");

const eventAssigneesSchema = mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  status: { type: Boolean, default: true },
  assigned: { type: Boolean, default: false },
});

const EventAssignees = mongoose.model("EventAssignees", eventAssigneesSchema);

module.exports = {EventAssignees};
