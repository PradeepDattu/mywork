const mongoose = require("mongoose");

const youtubeSchema = new mongoose.Schema({
  link1: String,
  link2: String,
  link3: String,
  link4: String,
});

const YoutubeModel = mongoose.model("youtube", youtubeSchema);

module.exports = {
  YoutubeModel,
};
