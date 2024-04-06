const { User } = require('../models');
const Post = require('../models/Post');
const Tag = require('../models/Tag');
const { Op, Sequelize } = require('sequelize');

module.exports.create = async function (req, res) {
  const { title, content, tags } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  console.log(req.user.id);

  try {
    // Create post
    const post = await Post.create({
      title,
      content,
      UserId: req.user.id,
    });

    // Create or find tags
    const tagInstances = await Promise.all(
      tags.map(async (tagName) => {
        let tagInstance = await Tag.findOne({ where: { name: tagName } });
        if (!tagInstance) {
          tagInstance = await Tag.create({ name: tagName });
        }
        return tagInstance;
      })
    );

    // Add tags to the post
    await post.addTags(tagInstances);
    if (req.xhr) {
      return res.status(200).json({
        data: {
          title: title,
          content: content,
          tags: tags,
        },
      });
    }

    res.redirect('/?success=Post added successfully.. ');
  } catch (error) {
    console.error('Error creating post:', error);
    return res.redirect('/?error=Somethingwents wrong..');
  }
};

module.exports.tagAdd = async function (req, res) {
  const postId = req.params.postId;
  const { tagName } = req.body;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.redirect('/?error=Post not found');
    }
    if (req.user.userType === 'Admin' || post.UserId === req.user.id) {
      if (!tagName || tagName.length < 3 || !/^[a-zA-Z0-9 ]+$/.test(tagName)) {
        return res.redirect('/?error=Invalid tag value');
      }
      // Find or create the tag
      const [tag] = await Tag.findOrCreate({ where: { name: tagName } });

      // Associate the tag with the post
      await post.addTag(tag);

      res.redirect('/?success=Tag added successfully.. ');
    } else {
      return res.redirect('/?error=Unuserized to add tag to this post');
    }
  } catch (error) {
    console.error('Error adding tag:', error);
    return res.redirect('/?error=somthing went wrong!!');
  }
};
module.exports.tagEdit = async (req, res) => {
  const postId = req.params.postId;
  const tagId = req.params.tagId;
  const newTagName = req.body.tagName;

  try {
    // Find the post by its ID
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.redirect('/?error=Post not found');
    }
    if (req.user.userType === 'Admin' || post.UserId === req.user.id) {
      if (
        !newTagName ||
        newTagName.length < 3 ||
        !/^[a-zA-Z0-9 ]+$/.test(newTagName)
      ) {
        return res.redirect('/?error=Invalid tag value');
      }

      // Delete the existing tag association
      await post.removeTag(tagId);

      let tag = await Tag.findOne({ where: { name: newTagName } });
      if (!tag) {
        tag = await Tag.create({ name: newTagName });
      }

      // Add the new tag association to the post
      await post.addTag(tag);

      return res.redirect('/?success=Tag updated successfully..');
    } else {
      return res.redirect('/?error=Unuserized to add tag to this post');
    }
  } catch (error) {
    return res.redirect('/?error=Somthing went wrong..');
    // res.status(500).send('Error updating tag: ' + error.message);
  }
};
module.exports.tagDel = async (req, res) => {
  const postId = req.params.postId;
  const tagId = req.params.tagId;

  try {
    // Find the post by its ID
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.redirect('/?error=Post not found');
    }
    if (req.user.userType === 'Admin' || post.UserId === req.user.id) {
      await post.removeTag(tagId);
      return res.redirect('/?success=Tag deleted successfully..');
    } else {
      return res.redirect('/?error=Unuserized to delete tag to this post');
    }
  } catch (error) {
    return res.redirect('/?error=Somthing went wrong..');
    // res.status(500).send('Error updating tag: ' + error.message);
  }
};

module.exports.search = async (req, res) => {
  const { startDate, endDate, user, selectedTags } = req.body;

  try {
    let whereClause = {};
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    // Build the where clause based on the provided parameters
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [startDate, endOfDay],
      };
    }
    if (user) {
      whereClause.userId = user;
    }
    if (selectedTags && selectedTags.length > 0) {
      if (Array.isArray(selectedTags)) {
        whereClause = {
          ...whereClause,
          // Use a subquery to filter posts based on the associated tags
          id: {
            [Op.in]: [
              // Subquery to find posts with associated tags in the selectedTags array
              Sequelize.literal(`
              SELECT PostId  FROM PostTag
              WHERE PostTag.TagId IN (${selectedTags.join(',')})
            `),
            ],
          },
        };
      } else {
        whereClause = {
          ...whereClause,
          // Use a subquery to filter posts based on the associated tags
          id: {
            [Op.in]: [
              // Subquery to find posts with associated tags in the selectedTags array
              Sequelize.literal(`
              SELECT PostId  FROM PostTag
              WHERE PostTag.TagId IN (${selectedTags})
            `),
            ],
          },
        };
      }
    }

    // Find blog posts based on the constructed where clause
    const posts = await Post.findAll({
      where: whereClause,
      // Include the associated user and tags in the result
      include: [
        {
          model: User,
        },
        {
          model: Tag,
        },
      ],
    });
    const authors = await User.findAll({});
    const tags = await Tag.findAll({});
    return res.render('home', {
      title: 'Home',
      posts: posts,
      authors,
      tags,
      currentUser: req.user,
    });
  } catch (error) {
    console.error('Error searching and filtering posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
