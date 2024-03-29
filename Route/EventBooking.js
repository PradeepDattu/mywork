const express = require("express");
const { EventModel } = require("../Model/EventBooking");
const Event = express.Router();
const { UsersModel } = require("../Model/User");
const { Whatsmsgadmin } = require("./Whatsmsgadmin");
Event.get("/", async (req, res) => {
  console.log("check search query")
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
      return dateA - dateB;
    });

    res.send(sortedData);
  } catch (err) {
    res.send(err);
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
  } catch(err) {
    res.send(err);
  }
});
Event.post("/", async (req, res) => {
  console.log("check normal post")
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
        gothram: payload.gotram ? payload.gotram : "",
      });
      await user.save();
    }

    const userid = await UsersModel.find({ phone: payload.phone });

    const id = userid[0]._id;
    if (!userid[0].address) {
      await UsersModel.findByIdAndUpdate(
        { _id: id },
        {
          address: payload.gotram,
        }
      );
    }
    if (!userid[0].gothram && payload.gotram) {
      await UsersModel.findByIdAndUpdate(
        { _id: id },
        {
          gothram: payload.gotram,
        }
      );
    }
    const data = new EventModel({
      ...payload,
      userId: id,
      bookingDate: formattedDate,
    });
    await data.save();

   
    res.send(data);
  
  } catch(err) {
    res.send(err);
  }
});

Event.post('/assignees', async (req, res) => {
  
  console.log("check assignee post");
  const { eventId, assignees } = req.body;

  const prevEvent =await EventModel.find({_id:eventId});

const preAssignees=await prevEvent[0].assignees;
const UpdatedObject={
eventName:prevEvent[0].eventName,
eventDate:prevEvent[0].eventDate,
eventTime:prevEvent[0].eventTime,
fname:prevEvent[0].fname,
lname:prevEvent[0].lname,
city:prevEvent[0].address+"_"+prevEvent[0].city};

assignees.forEach(async(ass)=>{
  

  const assi=preAssignees.filter((assss)=>assss._id==ass._id);
  
  if(assi&&assi[0]){
    if(assi[0].assigned!=ass.assigned){
    
      // console.log("assignee true details",ass.assigned,ass.mobile,ass._id);
    
      
      await Whatsmsgadmin(ass.assigned,UpdatedObject,ass.mobile);
      
    }
  }else if(ass.assigned){
    
    
    // console.log("assignee false details",ass.assigned,ass.mobile,ass._id);
    
    await Whatsmsgadmin(ass.assigned,UpdatedObject,ass.mobile);
    
  }

}
)

  try {
    await EventModel.updateOne({ _id: eventId }, { assignees: assignees });
    res.status(200).send('Assignees updated successfully');
  } catch (error) {
    res.status(500).send('Error updating assignees');
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
    res.send("Event Deleted Sucessfully");
  } catch (err) {
  
    res.send(err);
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
    if (payload.authorMessage) {
      const currentDate = new Date();

      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      // Add leading zero to month if necessary
      const formattedMonth = month < 10 ? `0${month}` : month;
      const formattedday = day < 10 ? `0${day}` : day;
      const formattedDate = `${formattedday}/${formattedMonth}/${year}`;
      const massege =
        payload.authorMessage + " " + "Updated Date" + ": " + formattedDate;
    
      await EventModel.findByIdAndUpdate(
        { _id: id },
        { ...payload, authorMessage: massege }
      );
    } else {
      await EventModel.findByIdAndUpdate({ _id: id }, { ...payload });
    }
    const newdata = await EventModel.find({ _id: id });
    const paymentnew = newdata[0].paymentStatus;
    const amountnew = newdata[0].ammount;
    const expensenew = newdata[0].expense;

    const user = await UsersModel.find({ _id: data[0].userId });
    let { paidAmmount } = user[0];
    let { remainAmmount } = user[0];
    let { expense } = user[0];

    if (payment == paymentnew) {
      
      if (amount != amountnew) {
        if (paymentnew) {
          paidAmmount += amountnew - amount;
        } else {
          
          remainAmmount += amountnew - amount;
        }
      }
    } else {
      if (payment) {
        paidAmmount -= amount;
        remainAmmount += amountnew;
      } else {
        
        paidAmmount += amountnew;
        remainAmmount -= amount;
      }
    }
    expense = expense + expensenew - expenses;

    await UsersModel.findByIdAndUpdate(
      { _id: data[0].userId },

      { paidAmmount, remainAmmount, expense }
    );
    res.send("Event Updated successfully");
  } catch (err) {

    res.send(err);
  }
});
module.exports = {
  Event,
};
