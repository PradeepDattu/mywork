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
  const foramttedday = day < 10 ? `0${day}` : day;
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
        {
          address: `${payload.address}, ${payload.pincode}, ${payload.district}`,
        }
      );
    }
    const data = new EventModel({
      ...payload,
      userId: id,
      bookingDate: formattedDate,
    });
    await data.save();

    //telegram bot notifications

    const handleSendNotification = () => {
      const telegram_bot_id = "5999513750:AAFth2FcbbXQc2aQp7k3s8NZnYBwcjaHNMQ";
      const messageBody = `New Event Details:

      Name: ${payload.fname} ${payload.lname}
      Phone: ${payload.phone}
      Email: ${payload.email}
      
      Event Name: ${payload.eventName}
      Event Date: ${payload.eventDate}
      Event Time: ${payload.eventTime}

      City: ${payload.city}
      Full Address: ${payload.address} ${payload.district} ${payload.pincode}
      
      Message: ${payload.message}
      
      Booking Date: ${formattedDate}`;

      const paylord = {
        chat_id: -1001698776848,
        text: messageBody,
      };

      const telegramApiUrl = `https://api.telegram.org/bot${telegram_bot_id}/sendMessage`;

      fetch(telegramApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cache-control": "no-cache",
        },
        body: JSON.stringify(paylord),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.ok) {
            console.log("Message sent successfully!");
          } else {
            console.log("An error occurred!");
          }
        })
        .catch((error) => {
          console.log("Error occurred while sending the message!");
          console.log(error);
        });
    };

    res.send(data);
    handleSendNotification();

    // res.send(data);
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
    const expenses = data[0].expense;

    const user = await UsersModel.find({ _id: data[0].userId });
    let { paidAmmount } = user[0];
    let { remainAmmount } = user[0];
    let { expense } = user[0];
    if (payment) {
      paidAmmount -= amount;
      await UsersModel.findByIdAndUpdate(
        { _id: data[0].userId },

        { paidAmmount }
      );
    } else {
      remainAmmount -= amount;
      await UsersModel.findByIdAndUpdate(
        { _id: data[0].userId },

        { remainAmmount }
      );
    }
    expense -= expenses;
    await UsersModel.findByIdAndUpdate(
      { _id: data[0].userId },

      { expense }
    );
    await EventModel.findByIdAndDelete({ _id: id });
    res.send("Delete Success");
  } catch (err) {
    console.log(err);
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
    const expenses = data[0].expense;

    await EventModel.findByIdAndUpdate({ _id: id }, { ...payload });
    const newdata = await EventModel.find({ _id: id });
    const paymentnew = newdata[0].paymentStatus;
    const amountnew = newdata[0].ammount;
    const expensenew = newdata[0].expense;

    const user = await UsersModel.find({ _id: data[0].userId });
    let { paidAmmount } = user[0];
    let { remainAmmount } = user[0];
    let { expense } = user[0];

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
    expense = expense + expensenew - expenses;
    const usersdata = await UsersModel.find({ _id: data[0].userId });
    console.log(paidAmmount, remainAmmount, usersdata);

    await UsersModel.findByIdAndUpdate(
      { _id: data[0].userId },

      { paidAmmount, remainAmmount, expense }
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
