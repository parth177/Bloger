// models/user.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming you have a separate database connection file
const Post = require('./Post');
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM('User', 'Admin'), // Define ENUM for user type
    allowNull: false,
  },
});

module.exports = User;
