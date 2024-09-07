'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding the 'lastSeen' column to the 'Users' table
    await queryInterface.addColumn('Users', 'lastSeen', {
      type: Sequelize.DATE,
      allowNull: true,  // Allows the field to be null
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'lastSeen' column from the 'Users' table
    await queryInterface.removeColumn('Users', 'lastSeen');
  }
};
