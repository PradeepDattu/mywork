const mongoose = require("mongoose");
const EventAssignees = require("./EventAssignees");

const eventSchema = mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String },
  userId: { type: String, required: true },
  eventId: { type: String, default: null },
  eventName: { type: String, default: null },
  phone: { type: String, required: true },
  bookingDate: { type: String, required: true },
  email: { type: String },
  pincode: { type: String, require: true },
  eventDate: { type: String, require: true },
  city: { type: String, default: null },
  message: { type: String },
  referedby: { type: String },
  eventStatus: { type: String, default: "Pending" },
  eventTime: { type: String, default: "00:00" },
  image: { type: String, default: null },
  paymentStatus: { type: Boolean, default: false },
  ammount: { type: Number, default: 0 },
  expense: { type: Number, default: 0 },
  address: { type: String, require: true },
  district: { type: String },
  gotram: { type: String },
  authorMessage: { type: String, default: null },
  gautarm: [
    {
      name: String,
      gautaram: String,
    },
  ],
});

eventSchema.add({
  assignees: [
    {
      
      name: { type: String, required: true },
  mobile: { type: String, required: true },
  status: { type: Boolean, default: true },
  assigned: { type: Boolean, default: false }
    }
  ]
});


const EventModel = mongoose.model("EventBooking", eventSchema);

module.exports = {
  EventModel,
};
