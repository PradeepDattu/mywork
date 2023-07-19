const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  fname:{ type: String, required: true },
  lname:{ type: String,default:null },
  email:{type:String,default:null},
  phone: { type: String, required: true },
  paidAmmount:{type:Number,default:0},
  remainAmmount:{type:Number,default:0},
  address:{type:String,default:null},
  nakshatra:{type: String,default:null},
  DOB:{type:String,default:null},
  TOB:{type:String,default:null},
  POB:{type:String,default:null}
});

const UsersModel = mongoose.model("users", usersSchema);

module.exports = {
  UsersModel,
};
  