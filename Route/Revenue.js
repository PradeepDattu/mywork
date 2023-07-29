const express = require("express");
const { RevenueModel } = require("../Model/Revenue");
const { UsersModel } = require("../Model/User");
const RevenueRoute = express.Router();
const { AppointmentModel } = require("../Model/Appoiment");
const { EventModel } = require("../Model/EventBooking");
const { HoroModel } = require("../Model/Horoscope");

RevenueRoute.get("/", async (req, res) => {
  const from = req.body.from;
  const to = req.body.to;

  console.log(from, to);

  try {
    const eventData = await EventModel.find()
      .sort((a, b) => a.eventDate - b.eventDate)
      .filter((dat) => dat.eventDate >= from && dat.eventDate <= to);
    console.log(eventData);
    const astroData = await HoroModel.find({
      // horoDate: {$and:[horoDate] },
      $and: [{ horoDate: { $gte: from } }, { horoDate: { $lte: to } }],
    });

    const rev = new RevenueModel();

    rev.paid =
      eventData
        .filter((dat) => dat.paymentStatus == true)
        .reduce((total, event) => total + event.ammount, 0) +
      astroData
        .filter((dat) => dat.paymentStatus == true)
        .reduce((total, event) => total + event.ammount, 0);
    rev.unpaid = eventData
      .filter((dat) => dat.paymentStatus == false)
      .reduce((total, event) => total + event.ammount, 0);
    rev.expense = eventData.reduce((total, event) => total + event.expense, 0);
    rev.transaction = rev.paid + rev.unpaid;
    rev.net = rev.transaction - rev.expense;
    res.send(rev);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = {
  RevenueRoute,
};
