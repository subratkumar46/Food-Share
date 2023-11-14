const mongoose = require("mongoose");
const Schema = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodType: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  quantity: {
    type: String,
    trim: true,  
  },
  oldFood: {
    type: String,
    trim: true, 
  },
  expiryDate: {
    type: Date,
    trim: true,
  },
  status: {
    type: String,
    default: 'pending',
    trim: true,
  },
  donorId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  pincode: {
    type: String,
    required: true
  }
});

const food = new mongoose.model('food', foodSchema);

module.exports = food;