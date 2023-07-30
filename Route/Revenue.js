const express = require("express");
const { RevenueModel } = require("../Model/Revenue");
const { UsersModel } = require("../Model/User");
const RevenueRoute = express.Router();
const { AppointmentModel } = require("../Model/Appoiment");
const { EventModel } = require("../Model/EventBooking");
const { HoroModel } = require("../Model/Horoscope");

// RevenueRoute.get("/", async (req, res) => {
//   const startDate = req.body.from;
//   const endDate = req.body.to;
// console.log(startDate,endDate)
//   try {
//     const events = await EventModel.find()
//     const eventsInRange = events.filter((event) => {
//       const eventDate = new Date(event.eventDate);
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       console.log(start,end,eventDate)
//       return eventDate >= start && eventDate <= end;
//     });

//     console.log(eventsInRange);

//     res.send("rev");
//   } catch (error) {
//     console.log(error);
//     res.send(error);
//   }
// });
function convertToDate(dateStr) {
  const dateComponents = dateStr.split("/");
  // Date constructor expects date components in the order: year, month, day
  return new Date(dateComponents[2], dateComponents[1] - 1, dateComponents[0]);
}
RevenueRoute.get("/", async (req, res) => {
  const startDateStr = req.query.from;
  const endDateStr = req.query.to;

  // Date constructor expects date components in the order: year, month, day
  const startDate = convertToDate(startDateStr);
  const endDate = convertToDate(endDateStr);
  // console.log(startDate, endDate);
  try {
    const events = await EventModel.find();
    const eventsInRange = events.filter((event) => {
      const eventDate = convertToDate(event.eventDate);
      return eventDate >= startDate && eventDate <= endDate;
    });
    // console.log(eventsInRange);
    const astroData = await HoroModel.find();
    const astroInRange = astroData.filter((asto) => {
      const horoDate = convertToDate(asto.horoDate);
      return horoDate >= startDate && horoDate <= endDate;
    });
    const rev = new RevenueModel();

    rev.paid =
      eventsInRange
        .filter((dat) => dat.paymentStatus == true)
        .reduce((total, event) => total + event.ammount, 0) +
      astroInRange
        .filter((dat) => dat.paymentStatus == true)
        .reduce((total, event) => total + event.ammount, 0);
    rev.unpaid = eventsInRange
      .filter((dat) => dat.paymentStatus == false)
      .reduce((total, event) => total + event.ammount, 0);
    rev.expense = eventsInRange.reduce(
      (total, event) => total + event.expense,
      0
    );
    rev.transaction = rev.paid + rev.unpaid;
    rev.net = rev.transaction - rev.expense;

    // Rest of your code to calculate revenue goes here...

    res.send(rev);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = {
  RevenueRoute,
};
