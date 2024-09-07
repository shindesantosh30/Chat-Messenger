require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DATABASE,  // Database name
  process.env.DB_USERNAME,  // Username
  process.env.DB_PASSWORD,  // Password
  {
    host: process.env.DB_HOST,  // Host
    dialect: process.env.DB_DIALECT,  // Dialect
    // logging: false
  }
);

module.exports = sequelize;
