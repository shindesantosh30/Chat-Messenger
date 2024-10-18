const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./users');
const Group = require('./groups');


const GroupUser = sequelize.define('GroupUser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Groups',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  tableName: 'GroupUsers',
  timestamps: true,
});

GroupUser.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
GroupUser.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = GroupUser;
