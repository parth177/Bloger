const { User } = require('../../models/User');
const Post = require('../../models/Post');
const Tag = require('../../models/Tag');
const { Op, Sequelize } = require('sequelize');


const validatePostData = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('tags').isArray().withMessage('Tags must be an array'),
];

module.exports.create =
