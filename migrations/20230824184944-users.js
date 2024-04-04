'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobile_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'pending'),
        allowNull: false,
        defaultValue: 'active',
      },
      isSuperAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles', // Reference the Roles table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Companies', // Reference the Companies table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      address_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Addresses', // Reference the Addresses table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    await queryInterface.addIndex('Users', ['email'], { unique: false });
    await queryInterface.addIndex('Users', ['mobile_number']);
    await queryInterface.addIndex('Users', ['username']);
    await queryInterface.addIndex('Users', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};
