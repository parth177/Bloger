const Post = require('./Post');
const Tag = require('./Tag');

Post.belongsToMany(Tag, { through: 'PostTag' });
Tag.belongsToMany(Post, { through: 'PostTag' });
