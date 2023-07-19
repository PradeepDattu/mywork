const mongoose = require("mongoose");
const Connect = mongoose.connect(
  "mongodb+srv://dattuorg:saipradeep1@dattu.4rwnwcc.mongodb.net/dattasai?retryWrites=true&w=majority"
);
module.exports = {
  Connect,
};
