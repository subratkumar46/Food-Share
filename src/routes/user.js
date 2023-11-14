const express = require("express");
const { auth } = require('../middlewares/auth');

const {
  login,
  register,
  logout,
  loginView,
  updateProfile,
  viewProfile,
} = require("../controllers/user.controller");

const route = express.Router();

route.get('/', loginView);
route.post('/login', login);
route.post('/register', register);
route.get('/logout', logout);
route.get('/profile', auth, viewProfile);
route.post('/profile', auth, updateProfile);

module.exports = route;
