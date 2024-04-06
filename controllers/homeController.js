const { Post } = require('../models');
const Tag = require('../models/Tag');
const { User } = require('../models');

module.exports.home = async function (req, res) {
  const errorMessage = req.query.error;
  const succesMessage = req.query.success;
  const posts = await Post.findAll({
    include: [
      {
        model: Tag,

        through: { attributes: [] },
      },
      { model: User },
    ],

    // include: User,
    order: [['createdAt', 'DESC']], // Order by creation time in descending order
  });
  console.log(posts);
  const authors = await User.findAll({});
  const tags = await Tag.findAll({});
  return res.render('home', {
    title: 'Home',
    posts: posts,
    authors,
    tags,
    currentUser: req.user,
    error: errorMessage,
    success: succesMessage,
  });
};
