const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

module.exports.login = async function (req, res) {
  return res.render('login', {
    title: 'Login',
  });
};

module.exports.signup = async (req, res) => {
  const { username, password, userType, confirmPassword } = req.body;
  if (password === confirmPassword) {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      // Username already in use, render signup page with error message
      return res.render('login', { error: 'Username already in use' });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const user = await User.create({
        username,
        password: hashedPassword,
        userType,
      });
      req.login(user, (err) => {
        if (err) {
          console.error('Error logging in user:', err);
          return res.redirect('/auth/login'); // Redirect to login page on error
        }
        return res.redirect('/'); // Redirect to home page after successful signup and login
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send('Error creating user.');
    }
  }
};
