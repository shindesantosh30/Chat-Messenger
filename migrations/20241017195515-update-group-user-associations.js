'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Ensure foreign key constraints are in place for the associations
    await queryInterface.addConstraint('GroupUsers', {
      fields: ['groupId'],
      type: 'foreign key',
      name: 'fk_group_users_group', // unique name for the constraint
      references: {
        table: 'Groups',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('GroupUsers', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_group_users_user', // unique name for the constraint
      references: {
        table: 'Users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove foreign key constraints
    await queryInterface.removeConstraint('GroupUsers', 'fk_group_users_group');
    await queryInterface.removeConstraint('GroupUsers', 'fk_group_users_user');
  }
};
