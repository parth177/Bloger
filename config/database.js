const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('blogs', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
