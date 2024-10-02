'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserSettings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      isPrivate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      showTypingIndicator: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      showOnlineStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      pushNotifications: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      theme: {
        type: Sequelize.ENUM('light', 'dark'),
        defaultValue: 'light',
      },
      lastSeenVisibility: {
        type: Sequelize.ENUM('everyone', 'contacts', 'nobody'),
        defaultValue: 'everyone',
      },
      profileVisibility: {
        type: Sequelize.ENUM('everyone', 'followers', 'nobody'),
        defaultValue: 'everyone', // Control who can view the profile
      },
      readReceipts: {
        type: Sequelize.ENUM('everyone', 'followers', 'nobody'),
        defaultValue: 'everyone', // Control who can see read receipts
      },
      statusVisibility: {
        type: Sequelize.ENUM('everyone', 'contacts', 'nobody'),
        defaultValue: 'everyone', // Control who can view status updates
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserSettings');
  }
};
