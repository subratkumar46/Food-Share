const mongoose = require("mongoose");
const Schema = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  emailID: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    default: "",
  },
  houseNo: {
    type: String,
    trim: true,
    default: "",
  },
  society: {
    type: String,
    trim: true,
    default: "",
  },
  landmark: {
    type: String,
    trim: true,
    default: "",
  },
  city: {
    type: String,
    trim: true,
    default: "",
  },
  pincode: {
    type: String,
    trim: true,
    default: "",
  },
  state: {
    type: String,
    trim: true,
    default: "",
  },
});

userSchema.methods.getToken = function ({ exp, secret }) {
  let token;
  if (exp) {
    token = jwt.sign({ id: this._id }, secret, {
      // This time is in second
      expiresIn: exp,
    });
  } else {
    token = jwt.sign({ id: this._id }, secret);
  }

  return token;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const user = new mongoose.model("user", userSchema);

module.exports = user;
