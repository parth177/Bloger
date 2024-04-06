'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'userType', {
      type: Sequelize.ENUM('User', 'Admin'),
      allowNull: false,
      defaultValue: 'User',
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'userType');
  },
};
