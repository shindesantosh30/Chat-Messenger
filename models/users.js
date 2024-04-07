const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');
const Role = require('./roles');

// Define the User model
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: true
  },
  mobile: {
    type: Sequelize.STRING,
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  roleId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'Roles',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
});

// Define the association with Role
User.belongsTo(Role, { foreignKey: 'roleId' });

// Export the User model
module.exports = User;
