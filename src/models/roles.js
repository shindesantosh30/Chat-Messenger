// models/role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Roles = sequelize.define('Roles', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
});

module.exports = Roles;
