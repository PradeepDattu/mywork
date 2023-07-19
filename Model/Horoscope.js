const mongoose = require("mongoose");

const horoSchema = mongoose.Schema({
  fname:{ type: String, required: true },
  lname:{ type: String },
  userId:{type:String,required:true},
  email:{type:String},
  phone: { type: String, required: true },
  address:{type:String,required: true},
  DOB:{type:String,default:null},
  city:{ type: String, default:null },
  TOB:{type:String,default:null},
  POB:{type:String,default:null},
  message:{type: String},
  nakshatra:{type: String},
  paymentStatus:{type:Boolean,default:false},
  ammount:{type:Number,default:0},
  horoStatus:{type:String,default:"Pending"},
  horoDate:{type:String},
  authorMessage: { type: String,default: null }
});

const HoroModel = mongoose.model("horoScope", horoSchema);

module.exports = {
  HoroModel,
};
  