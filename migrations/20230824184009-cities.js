'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      id_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      state_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'States', // Reference the States table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    await queryInterface.addIndex('Cities', ['name']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Cities');
  },
};
