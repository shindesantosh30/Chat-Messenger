'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Followers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',  // Ensure this matches the name of your Users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      followerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',  // Ensure this matches the name of your Users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      requestStatus: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1,  // 1 represents 'Pending' by default
      },
      isBlocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      unfollowedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Followers');
  }
};
