const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./users');
const Asset = require('./assets');

const Message = sequelize.define('Message', {
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isSeen: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  attachmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Assets',
      key: 'id',
    },
  },
}, {
  tableName: 'Messages',
  timestamps: true,
});

// Associations
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
Message.belongsTo(Asset, { foreignKey: 'attachmentId', as: 'attachment' }); // Use the renamed field

module.exports = Message;
