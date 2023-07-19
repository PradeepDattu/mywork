const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true },
});

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = {
  AdminModel,
};
