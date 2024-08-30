const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');


// Define the Role model
const Role = sequelize.define('Role', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: Sequelize.STRING,
    allowNull: false
  }
},
  {
    tableName: 'Roles',
    timestamps: false
  }
);

module.exports = Role;
