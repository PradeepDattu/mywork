const mongoose = require("mongoose");

const panchamSchema = mongoose.Schema({
  data: { type: Object, required: true },
  date: { type: String, required: true },
});

const PanchamModel = mongoose.model("pancham", panchamSchema);

module.exports = {
  PanchamModel,
};
