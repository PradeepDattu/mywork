const express = require("express");
const whats = express.Router();
const { Whatsmsg } = require("./Whatsmsg");
const { Whatsmsgadmin } = require("./Whatsmsgadmin");
const numberAdmin1 = '9908875186';
const numberAdmin2 = '7207706106';

async function sendMessages(type, payload, numberAdmin1,numberAdmin2) {
  try {
    // Depending on the type, send appropriate messages
    let result1='no result 1';
    let result2='no result 2';
    let result3='no result 3';
    switch (type) {
      case 'astro':
        result1=await Whatsmsg('astro_form', payload.phone, `${payload.fname} ${payload.lname || ''}`, '', '');
        result2=await Whatsmsgadmin('astro_form_admin', payload, numberAdmin1);
        result3=await Whatsmsgadmin('astro_form_admin', payload, numberAdmin2);
        break;
      case 'appoint':
        result1=await Whatsmsg('appointment_form', payload.phone, `${payload.fname} ${payload.lname || ''}`, `${payload.appointmentDate}`, '');
        result2=await Whatsmsgadmin('appointment_form_admin', payload, numberAdmin1);
        result3=await Whatsmsgadmin('appointment_form_admin', payload, numberAdmin2);
        break;
      case 'contact':
        result1=await Whatsmsg('contact_form', payload.phone, `${payload.fname} ${payload.lname || ''}`, '', '');
        result2=await Whatsmsgadmin('appointment_form_admin', payload, numberAdmin1);
        result3=await Whatsmsgadmin('appointment_form_admin', payload, numberAdmin2);
        break;
      case 'event':
        result1=await Whatsmsg('event_form', payload.phone, `${payload.fname} ${payload.lname || ''}`, `${payload.eventDate}`, payload.eventName);
        result2=await Whatsmsgadmin('event_form_admin', payload, numberAdmin1);
        result3=await Whatsmsgadmin('event_form_admin', payload, numberAdmin2);
        break;
      default:
        throw new Error('Invalid message type');
    }
    return `${result1} and ${result2} and ${result3}`;
  } catch (err) {
    throw err;
  }
}

// Refactored route handlers using a single function to handle message sending
whats.post("/astro", async (req, res) => {
  try {
    const result = await sendMessages('astro', req.body, numberAdmin1,numberAdmin2);
    
    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

whats.post("/appoint", async (req, res) => {
  try {
    const result = await sendMessages('appoint', req.body, numberAdmin1,numberAdmin2);
    
    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

whats.post("/contact", async (req, res) => {
  try {
    const result = await sendMessages('contact', req.body, numberAdmin1,numberAdmin2);

    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

whats.post("/event", async (req, res) => {
  try {
    const result = await sendMessages('event', req.body, numberAdmin1,numberAdmin2);
    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = {
  whats,
};
