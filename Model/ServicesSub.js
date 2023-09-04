const mongoose = require("mongoose");

const servicesSubSchema = mongoose.Schema({
  mainId: { type: String, required: true },
  mainname: { type: String, required: true },
  ssname: { type: String, required: true },
  image: { type: String },
  purpose: { type: String },
  description: { type: String },
  sdescription: { type: String },
  samegri: { type: String },
  wedo: { type: String },
  starting: { type: Number, default: 50 },
});

const ServicesSubModel = mongoose.model("servicesSub", servicesSubSchema);

module.exports = {
  ServicesSubModel,
};
