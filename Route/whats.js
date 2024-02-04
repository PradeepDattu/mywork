const express = require("express");

const whats = express.Router();
const {Whatsmsg} = require("./Whatsmsg");

whats.post("/astro", async (req, res) =>{

  payload=req.body;
try{Whatsmsg('astro_form',payload.phone,payload.fname+' '+(payload.lname ? payload.lname : ''),'','');

res.send("sent");}catch(err){res.send(err)}
  
});

module.exports = {
    whats,
  };
  