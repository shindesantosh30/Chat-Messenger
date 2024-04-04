'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      emp_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      adhar_card: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pan_card: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      joining_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      birth_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Replace with the actual table name for the User model
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Companies', // Replace with the actual table name for the Companies model
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      address_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Addresses', // Replace with the actual table name for the Address model
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add indexes
    await queryInterface.addIndex('Employees', ['emp_id'], { unique: true });
    await queryInterface.addIndex('Employees', ['adhar_card']);
    await queryInterface.addIndex('Employees', ['pan_card']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Employees');
  },
};
