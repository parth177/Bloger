// models/index.js
const User = require('./User');
const Post = require('./Post');

// Define associations
User.hasMany(Post);
Post.belongsTo(User);

module.exports = { User, Post };
