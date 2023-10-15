const mongoose = require("mongoose");

const youTubeLinkSchema = new mongoose.Schema({
  link1: String,
  link2: String,
  link3: String,
  link4: String,
});

module.exports = mongoose.model("YouTubeLink", youTubeLinkSchema);
