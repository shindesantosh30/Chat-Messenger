'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobile: {
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
      cin_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gst_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      registration_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      website_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
    await queryInterface.addIndex('Companies', ['email'], { unique: false });
    await queryInterface.addIndex('Companies', ['mobile']);
    await queryInterface.addIndex('Companies', ['status']);
    await queryInterface.addIndex('Companies', ['username']);
    await queryInterface.addIndex('Companies', ['gst_number']);
    await queryInterface.addIndex('Companies', ['cin_number']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Companies');
  },
};
