const express = require("express");
const whats = express.Router();
const { Whatsmsg } = require("./Whatsmsg");
const { Whatsmsgadmin } = require("./Whatsmsgadmin");
const numberAdmin1 = '9908875186';
const numberAdmin2 = '7207706106';

async function sendMessages(type, payload, numberAdmin1,numberAdmin2) {
  try {
    // Depending on the type, send appropriate messages
    switch (type) {
      case 'astro':
        await Whatsmsg('astro_form', payload.phone, `${payload.fname} ${payload.lname || ''}`, '', '');
        await Whatsmsgadmin('astro_form_admin', payload, numberAdmin1);
        await Whatsmsgadmin('astro_form_admin', payload, numberAdmin2);
        break;
      case 'appoint':
        await Whatsmsg('appointment_form', payload.phone, `${payload.fname} ${payload.lname || ''}`, `${payload.appointmentDate}`, '');
        await Whatsmsgadmin('appointment_form_admin', payload, numberAdmin1);
        await Whatsmsgadmin('appointment_form_admin', payload, numberAdmin2);
        break;
      case 'contact':
        await Whatsmsg('contact_form', payload.phone, `${payload.fname} ${payload.lname || ''}`, '', '');
        await Whatsmsgadmin('appointment_form_admin', payload, numberAdmin1);
        await Whatsmsgadmin('appointment_form_admin', payload, numberAdmin2);
        break;
      case 'event':
        await Whatsmsg('event_form', payload.phone, `${payload.fname} ${payload.lname || ''}`, `${payload.eventDate}`, payload.eventName);
        await Whatsmsgadmin('event_form_admin', payload, numberAdmin1);
        await Whatsmsgadmin('event_form_admin', payload, numberAdmin2);
        break;
      default:
        throw new Error('Invalid message type');
    }
    return 'sent';
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
