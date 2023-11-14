const mongoose = require("mongoose");
const Schema = require("mongoose");

const requestSchema = new mongoose.Schema({
  donorId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  foodId: {
    type: Schema.Types.ObjectId,
    ref: "food",
  },
  status: {
    type: String,
    default: "pending",
    trim: true,
  },
});

const request = new mongoose.model('request', requestSchema);

module.exports = request;