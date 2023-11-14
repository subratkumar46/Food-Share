const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const user = require("../models/user");
const { successResponse, errorResponse } = require("../utils");

const login = async (req, res) => {
  try {
    const emailID = req.body.emailID;
    const password = req.body.password;
    const role = req.body.role

    // check for email exist or not
    const userData = await user.findOne({ emailID: emailID, role: role });
    if (!userData) {
      return errorResponse(req, res, "Invalid credentials!", 404);
    }

    // check for the password
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      res.render("login");

      // return errorResponse(req, res, 'Invalid credentials!', 404);
    } else {
      // jwt token created
      let accessToken = userData.getToken({
        exp: 60 * 60,
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      res.cookie("accessToken", accessToken);
      await userData.save();

      if (role === "donor") {
        console.log('donor login')
        if(userData.pincode === "") 
          res.redirect('/profile');
        else
          res.redirect("/foodbydonor");
      }
      else {
        console.log('customer login');
        if(userData.pincode === "") 
          res.redirect('/profile');
        else
          res.redirect("/allfood");
      }
      // return successResponse(req, res, accessToken, 200);
    }
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, "something went wrong!", 400, {
      err: error,
    });
  }
};

const register = async (req, res) => {
  try {
    const { userName, emailID, password, role } = new user(req.body);

    // check if email id allready exist
    const userData = await user.findOne({ emailID: emailID });

    if (userData) {
      return errorResponse(req, res, "email id allready exist", 400);
    } else {
      // creating payload
      const payload = {
        userName,
        emailID,
        password,
        role,
      };

      // register new user
      const newUser = new user(payload);
      const insertUser = await newUser.save();

      console.log("Registration Successful");
      res.render("login");
      // return successResponse(req, res, insertUser, 200);
    }
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const loginView = async (req, res) => {
  res.render("login");
};

const viewProfile = async (req, res) => {
  try {
      const id = req.user._id;
      console.log(id);
      let userData = await user.findOne({ _id: id });
      res.render("userProfile", { users: userData });  
  } catch (error) {
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const updateProfile = async (req, res) => {
  try {
    let userId = req.user._id;

    // updating user details
    const userData = await user.findByIdAndUpdate(userId, {
      userName : req.body.userName,
      phone: req.body.phone,
      houseNo: req.body.houseNo,
      society: req.body.society,
      landmark: req.body.landmark, 
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
    });

    if (!userData) {
      return errorResponse(req, res, "User Not Found", 404);
    } else {
      if (userData.role === "donor") {
        res.redirect("/foodbydonor");
      }
      else {
        res.redirect("/allfood");
      }
    }
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, "something went wrong", 400);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    return res.redirect("/");
  } catch (error) {
    return errorResponse(req, res, "Error while logging out", 500);
  }
};


module.exports = {
  login,
  register,
  logout,
  loginView,
  viewProfile,
  updateProfile,
};
