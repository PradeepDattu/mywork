const express = require("express");

const whats = express.Router();
const {Whatsmsg} = require("./Whatsmsg");
const {Whatsmsgadmin} = require("./Whatsmsgadmin");
const numberAdmin1='8500291085';

whats.post("/astro", async (req, res) =>{

  payload=req.body;
try{Whatsmsg('astro_form',payload.phone,payload.fname+' '+(payload.lname ? payload.lname : ''),'','');
Whatsmsgadmin('astro_form_admin',payload,numberAdmin1);

res.send("sent");}catch(err){res.send(err)}
  
});
whats.post("/appoint", async (req, res) =>{

  payload=req.body;
try{


    Whatsmsg('appointment_form',payload.phone,payload.fname+' '+(payload.lname ? payload.lname : ''),''+payload.appointmentDate,'');
    Whatsmsgadmin('appointment_form_admin',payload,numberAdmin1);
    res.send("sent");}catch(err){res.send(err)}
  
});

whats.post("/contact", async (req, res) =>{

  payload=req.body;
try{


    Whatsmsg('contact_form',payload.phone,payload.fname+' '+(payload.lname ? payload.lname : ''),'','');
    Whatsmsgadmin('appointment_form_admin',payload,numberAdmin1);
res.send("sent");}catch(err){res.send(err)}
  
});
whats.post("/event", async (req, res) =>{

  payload=req.body;
try{


  Whatsmsg('event_form',payload.phone,payload.fname+' '+(payload.lname ? payload.lname : ''),''+payload.eventDate,payload.eventName);
  Whatsmsgadmin('event_form_admin',payload,numberAdmin1);
res.send("sent");}catch(err){res.send(err)}
  
});




module.exports = {
    whats,
  };
  