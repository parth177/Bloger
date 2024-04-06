const { User } = require('../../models/User');
const Post = require('../../models/Post');
const Tag = require('../../models/Tag');
const { Op, Sequelize } = require('sequelize');

module.exports.create = async function (req, res) {
  const { title, content, tags } = req.body;

  try {
    // Create post
    const post = await Post.create({
      title,
      content,
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

    return res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
module.exports.tagAdd = async (req, res) => {
  const postId = req.params.postId;
  const { userId, tagName } = req.body;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is the owner of the post or an admin
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.userType === 'Admin' || post.UserId === userId) {
      if (!tagName || tagName.length < 3 || !/^[a-zA-Z0-9 ]+$/.test(tagName)) {
        return res.status(400).json({ error: 'Invalid tag value' });
      }
      // Find or create the tag
      const [tag] = await Tag.findOrCreate({ where: { name: tagName } });

      // Associate the tag with the post
      await post.addTag(tag);

      res.status(200).json({ success: 'Tag added successfully' });
    } else {
      return res
        .status(403)
        .json({ error: 'Unauthorized to add tag to this post' });
    }
  } catch (error) {
    console.error('Error adding tag:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
module.exports.tagEdit = async (req, res) => {
  const userId = req.body.userId;
  const postId = req.params.postId;
  const tagId = req.params.tagId;
  const newTagName = req.body.tagName;

  try {
    // Find the user by their ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the post by its ID
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is an admin or the author of the post
    if (user.userType !== 'Admin' && post.UserId !== user.id) {
      return res
        .status(403)
        .json({ error: 'Unauthorized to edit tag for this post' });
    }

    // Validate the new tag name
    if (
      !newTagName ||
      newTagName.length < 3 ||
      !/^[a-zA-Z0-9 ]+$/.test(newTagName)
    ) {
      return res.status(400).json({ error: 'Invalid tag value' });
    }

    // Delete the existing tag association
    await post.removeTag(tagId);

    // Find or create the new tag
    let tag = await Tag.findOne({ where: { name: newTagName } });
    if (!tag) {
      tag = await Tag.create({ name: newTagName });
    }

    // Add the new tag association to the post
    await post.addTag(tag);

    return res.status(200).json({ message: 'Tag updated successfully' });
  } catch (error) {
    console.error('Error updating tag:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports.tagDel = async (req, res) => {
  const { userId, postId, tagId } = req.body;

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the post by its ID
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the user is authorized to delete the tag for this post
    if (user.userType !== 'Admin' && post.UserId !== user.id) {
      return res
        .status(403)
        .json({ error: 'Unauthorized to delete tag from this post' });
    }

    // Remove the tag association from the post
    await post.removeTag(tagId);

    return res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return res.status(500).json({ error: 'Something went wrong' });
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
      const selectedTagIds = Array.isArray(selectedTags)
        ? selectedTags
        : [selectedTags];

      // Use a subquery to filter posts based on the associated tags
      whereClause.id = {
        [Op.in]: [
          // Subquery to find posts with associated tags in the selectedTags array
          Sequelize.literal(`
            SELECT PostId  FROM PostTag
            WHERE PostTag.TagId IN (${selectedTagIds.join(',')})
          `),
        ],
      };
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

    // Render the response with the found posts, authors, and tags
    return res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
