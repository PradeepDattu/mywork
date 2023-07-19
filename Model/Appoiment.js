const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String },
  userId: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  // address: { type: String, default: null },
  // pincode: { type: String, default: null},
  city:{ type: String, default:null },
  appointmentTime:{ type: String, default:null },
  bookingDate: { type: String, required: true },
  appointmentDate: { type: String, default: "Any Time" },
  message: { type: String },
  authorMessage: { type: String, default: null },
  appointmentStatus: { type: String, default: "Pending" },
});

const AppointmentModel = mongoose.model("appointment", appointmentSchema);

module.exports = {
  AppointmentModel,
};
