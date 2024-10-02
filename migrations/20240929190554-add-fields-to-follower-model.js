'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Followers', 'requestStatus', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1, // Default to PENDING
      validate: {
        isIn: [[1, 2, 3]], // Allowed values: PENDING, ACCEPTED, REJECTED
      },
    });

    await queryInterface.addColumn('Followers', 'isBlocked', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn('Followers', 'unfollowedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Followers', 'requestStatus');
    await queryInterface.removeColumn('Followers', 'isBlocked');
    await queryInterface.removeColumn('Followers', 'unfollowedAt');
  }
};
