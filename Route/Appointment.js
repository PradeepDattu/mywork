const express = require("express");
const { AppointmentModel } = require("../Model/Appoiment");
const Appointment = express.Router();
const { UsersModel } = require("../Model/User");
Appointment.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    let data;

    if (query) {
      data = await AppointmentModel.find({
        $or: [
          { appointmentDate: { $regex: query, $options: "i" } },
          { fname: { $regex: query, $options: "i" } },
          { lname: { $regex: query, $options: "i" } },
          { phone: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { city: { $regex: query, $options: "i" } },
          { bookingDate: { $regex: query, $options: "i" } },
          { appointmentStatus: { $regex: query, $options: "i" } },
        ],
      })
        .sort({ appointmentDate: "asc" })
        .exec();
    } else {
      data = await AppointmentModel.find()
        .sort({ appointmentDate: "asc" })
        .exec();
    }

    const sortedData = data.sort((a, b) => {
      const [dayA, monthA, yearA] = a.appointmentDate.split("/");
      const [dayB, monthB, yearB] = b.appointmentDate.split("/");
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      const statusA = a.appointmentStatus.toLowerCase();
      const statusB = b.appointmentStatus.toLowerCase();

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
  } catch (error) {
    console.error(error);
    res.send("Error");
  }
});


Appointment.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const data = await AppointmentModel.find({ userId: id }).sort({
      appointmentDate: "asc",
    });
    const sortedData = data.sort((a, b) => {
      const [dayA, monthA, yearA] = a.appointmentDate.split("/");
      const [dayB, monthB, yearB] = b.appointmentDate.split("/");
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      return dateA - dateB;
    });
    res.send(sortedData);
  } catch {
    res.send("Error");
  }
});
Appointment.post("/", async (req, res) => {
  const payload = req.body;
  let check = await UsersModel.find({ phone: payload.phone });
  console.log(check);
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  
  // Add leading zero to month if necessary
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedday= day <10 ?`0${day}`: day;
  const formattedDate = `${formattedday}/${formattedMonth}/${year}`;
  try {
    if (check.length == 0) {
      const user = new UsersModel({
        phone: payload.phone,
        fname: payload.fname,
        lname: payload.lname ? payload.lname : "",
        email: payload.email ? payload.email : "",
      });
      await user.save(); 
      console.log("user save");
    }
    const userid = await UsersModel.find({ phone: payload.phone });
    const id = userid[0]._id;
    const data = new AppointmentModel({ ...payload, userId: id,bookingDate:formattedDate });
    await data.save();
    res.send(data); 
  } catch (err) {
    res.send("Post ERRoR");
    console.log(err);
  }
});

Appointment.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await AppointmentModel.findByIdAndDelete({ _id: id });
    res.send("Delete Success");
  } catch {
    res.send("Delete Error");
  }
});

Appointment.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  try {
    await AppointmentModel.findByIdAndUpdate({ _id: id }, payload);
    res.send("Update Success");
  } catch {
    res.send("Update Error");
  }
});

module.exports = {
  Appointment,
};
