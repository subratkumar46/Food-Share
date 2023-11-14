const express = require('express');
const { auth } = require("../middlewares/auth");
const upload = require('./../middlewares/upload');

const {
  foodByDonor,
  addFood,
  viewRequest,
  acceptRequest,
  allFood,
  sendRequest,
  acceptedView,
  addFoodView,
} = require('../controllers/food.controller');

const route = express.Router();

// donor
route.get('/foodbydonor', auth, foodByDonor);
route.get('/food', auth, addFoodView);
route.post('/addfood', auth, upload.single("image"), addFood);
route.get('/request/:id', auth, viewRequest);
route.get('/accept/:id', auth, acceptRequest);

// customer
route.get('/allfood', auth, allFood);
route.get('/sendrequest/:id', auth, sendRequest);
route.get('/accepted', auth, acceptedView);

module.exports = route;