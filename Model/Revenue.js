const mongoose = require("mongoose");

const revenueSchema = mongoose.Schema({
  transaction: { type: Number, default: 0 },
  paid: { type: Number, default: 0 },
  unpaid: { type: Number, default: 0 },
  expense: { type: Number, default: 0 },
  net: { type: Number, default: 0 },
  event:{ type: Number, default: 0 },
  astro:{ type: Number, default: 0 }
});

const RevenueModel = mongoose.model("revenue", revenueSchema);

module.exports = {
  RevenueModel,
};
