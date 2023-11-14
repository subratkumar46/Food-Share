const food = require('../models/food');
const user = require('../models/user');
const request = require('../models/request');

const { successResponse, errorResponse } = require('../utils');

// donor

const foodByDonor = async (req, res) => {
  try {
    let userId = req.user._id;
    const foodData = await food.find({donorId: userId});
    console.log('foodData-->', foodData);
    res.render("foodByDonor", { foods: foodData });
  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

const addFoodView = async(req, res) => {
  res.render("addFood");
}

const addFood = async (req, res) => {
  try {

    let userId = req.user._id;

    const userData = await user.findOne({ _id: userId });

    const payload = {
      foodType: req.body.foodType,
      image: req.file.path,
      quantity: req.body.quantity,
      oldFood: req.body.oldFood,
      expiryDate: req.body.expiryDate,
      donorId: userId,
      pincode: userData.pincode,
    };
    console.log(payload);
    // register new user
    const newFood = new food(payload);
    const insertFood = await newFood.save();

    console.log('insertFood-->', insertFood);
    console.log("Food Added Successful");
    res.redirect("/foodbydonor");

  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const viewRequest = async (req, res) => {
  try {

    let foodId = req.params.id;
    const requestData = await request.find({foodId: foodId}).populate("foodId").populate("customerId");

    console.log(requestData);
    res.render("viewRequest", { requests: requestData });

  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

const acceptRequest = async (req, res) => {
  try {

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    let requestId = req.params.id;
    let status = 'accepted';
    const requestData = await request.findByIdAndUpdate({ _id: requestId }, { status: status });
    console.log('requestData-->', requestData);
    await sleep(1000);
    status = 'donated';
    console.log(requestData.foodId);

    const foodData = await food.findByIdAndUpdate({ _id: requestData.foodId }, { status: status });
    console.log('foodData-->', foodData);
    res.redirect('/foodbydonor');

  } catch(error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

// customer
const allFood = async (req, res) => {
  try {

    const currentDate = new Date();
    let userId = req.user._id;
    const userData = await user.findOne({ _id: userId });
    const pincode = userData.pincode;
    const status = 'pending';

    const foodData = await food.find({pincode: pincode, status: status, expiryDate: { $gt: currentDate }}).populate("donorId");
    console.log('foodData-->', foodData);
    res.render("allFood", { foods: foodData });

  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

const sendRequest = async (req, res) => {
  try {

    let userId = req.user._id;
    let foodId = req.params.id;
    console.log(req.params);
    const foodData = await food.findOne({ _id: foodId });
    console.log(foodData);
    const payload = {
      donorId: foodData.donorId,
      customerId: userId,
      foodId: foodId,
    };

    // register new user
    const newrequest = new request(payload);
    const insertRequest = await newrequest.save();

    console.log('insertRequest-->', insertRequest);
    console.log("Request Added Successful");
    res.redirect("/allfood");

  } catch (error) {
    console.log(error.message);
    return errorResponse(req, res, 'something went wrong', 500, { err: error });
  }
};

const acceptedView = async (req, res) => {
  try {

    const userId = req.user._id;
    const status = 'accepted';

    const requestData = await request.find({customerId: userId, status: status}).populate("donorId").populate("foodId");
    console.log('requestData-->', requestData);
    res.render("acceptedView", { requests: requestData });

  } catch (error) {
    return errorResponse(req, res, 'something went wrong', 400, { err: error });
  }
};

module.exports = { 
    foodByDonor,
    addFoodView,
    addFood,
    viewRequest,
    acceptRequest,
    allFood,
    sendRequest,
    acceptedView,
};
