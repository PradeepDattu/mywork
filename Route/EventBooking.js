const express = require("express");
const { EventModel } = require("../Model/EventBooking");
const Event = express.Router();
const { UsersModel } = require("../Model/User");
Event.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    let data;

    if (query) {
      data = await EventModel.find({
        $or: [
          { eventDate: { $regex: query, $options: "i" } },
          { phone: { $regex: query, $options: "i" } },
          { fname: { $regex: query, $options: "i" } },
          { district: { $regex: query, $options: "i" } },
          { bookingDate: { $regex: query, $options: "i" } },
          { eventName: { $regex: query, $options: "i" } },
          { lname: { $regex: query, $options: "i" } },
          { city: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { pincode: { $regex: query, $options: "i" } },
          { eventStatus: { $regex: query, $options: "i" } },
        ],
      })
        .sort({ eventDate: "asc" })
        .exec();
    } else {
      data = await EventModel.find().sort({ eventDate: "asc" }).exec();
    } 

    const sortedData = data.sort((a, b) => {
      const [dayA, monthA, yearA] = a.eventDate.split("/");
      const [dayB, monthB, yearB] = b.eventDate.split("/");
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      return dateB - dateA;
    });

    res.send(sortedData);
  } catch (err) {
    res.send("Error");
    console.log(err);
  }
});

Event.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await EventModel.find({ userId: id }).sort({
      eventDate: "asc",
    });
    const sortedData = data.sort((a, b) => {
      const [dayA, monthA, yearA] = a.eventDate.split("/");
      const [dayB, monthB, yearB] = b.eventDate.split("/");
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      const statusA = a.eventStatus.toLowerCase();
      const statusB = b.eventStatus.toLowerCase();

      if (statusA === "pending" && statusB !== "pending") {
        return -1;
      } else if (statusA !== "pending" && statusB === "pending") {
        return 1;
      } else if (statusA === "pending" && statusB === "pending") {
        return dateA - dateB;
      } else {
        return dateA - dateB;
      }
    });
    res.send(sortedData);
  } catch {
    res.send("Error");
  }
});
Event.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await EventModel.find({ eventId: id }).sort({
      eventDate: "asc",
    });
    const sortedData = data.sort((a, b) => {
      const [dayA, monthA, yearA] = a.eventDate.split("/");
      const [dayB, monthB, yearB] = b.eventDate.split("/");
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      return dateA - dateB;
    });
    res.send(sortedData);
  } catch {
    res.send("Error");
  }
});
Event.post("/", async (req, res) => {
  const payload = req.body;
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  
  // Add leading zero to month if necessary
  const formattedMonth = month < 10 ? `0${month}` : month;
  const foramttedday=day<10?`0${day}`:day
  const formattedDate = `${foramttedday}/${formattedMonth}/${year}`;
  let check = await UsersModel.find({ phone: payload.phone });
  try {
    if (check.length == 0) {
      const user = new UsersModel({
        phone: payload.phone,
        fname: payload.fname,
        lname: payload.lname ? payload.lname : "",
        email: payload.email ? payload.email : "",
        address: `${payload.address}, ${payload.pincode}, ${payload.district}`,
      });
      await user.save();
      console.log("user save");
    }

    const userid = await UsersModel.find({ phone: payload.phone });

    const id = userid[0]._id;
    if (!userid[0].address) {
      await UsersModel.findByIdAndUpdate(
        { _id: id },
        { address: `${payload.address}, ${payload.pincode}, ${payload.district}` }
      );
    }
    const data = new EventModel({ ...payload, userId: id,bookingDate:formattedDate });
    await data.save();
    res.send(data);
  } catch {
    res.send("err"); 
  }
});
Event.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await EventModel.find({ _id: id });
    const payment = data[0].paymentStatus;
    const amount = data[0].ammount;
   
    const user = await UsersModel.find({ _id: data[0].userId });
    let { paidAmmount } = user[0];
    let { remainAmmount } = user[0];
    if(payment){
      paidAmmount -= amount;
      await UsersModel.findByIdAndUpdate(
        { _id: data[0].userId },
  
        { paidAmmount}
      );
    }
    else{
      remainAmmount -= amount;
      await UsersModel.findByIdAndUpdate(
        { _id: data[0].userId },
  
        {remainAmmount }
      );
    }
    await EventModel.findByIdAndDelete({ _id: id });
    res.send("Delete Success");
  } catch(err) {
    console.log(err)
    res.send("Delete Error");
  }
});
  
Event.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const payload = req.body;

  try {
    const data = await EventModel.find({ _id: id });
    const payment = data[0].paymentStatus;
    const amount = data[0].ammount;

    await EventModel.findByIdAndUpdate({ _id: id }, { ...payload });
    const newdata = await EventModel.find({ _id: id });
    const paymentnew = newdata[0].paymentStatus;
    const amountnew = newdata[0].ammount;

    const user = await UsersModel.find({ _id: data[0].userId });
    let { paidAmmount } = user[0];
    let { remainAmmount } = user[0];

    if (payment == paymentnew) {
      
      console.log(amount, amountnew);
      if (amount != amountnew) {
        
        if (paymentnew) {
          paidAmmount += amountnew - amount;
        } else {
          console.log("running");
          remainAmmount += amountnew - amount;
        }
      }
    } else {
      if (payment) {
        paidAmmount -= amount;
        remainAmmount += amountnew;
      } else {
        console.log("5th");
        paidAmmount += amountnew;
        remainAmmount -= amount;
      }
    }
    const usersdata = await UsersModel.find({ _id: data[0].userId });
    console.log(paidAmmount, remainAmmount, usersdata);

    await UsersModel.findByIdAndUpdate(
      { _id: data[0].userId },

      { paidAmmount, remainAmmount }
    );
    res.send("Updated successfully");
  } catch (err) {
    console.log(err);
    res.send("Update Error");
  }
});
module.exports = {
  Event,
};
