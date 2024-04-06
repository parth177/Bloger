// authRoutes.js
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const authController = require('../controllers/authController');
const router = express.Router();

// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/?success=Logged in successfully.. ');
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    res.render('login');
  });
});

module.exports = router;
