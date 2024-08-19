const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Message = sequelize.define('Message', {
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  isEdited: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isSeen: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  attachment: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Assets',
      key: 'id'
    }
  }
}, {
  modelName: 'Messages',
  // Other options can be specified here, such as tableName, timestamps, etc.
});

// Define associations
Message.associate = function (models) {
  Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
  Message.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
  Message.belongsTo(models.Asset, { foreignKey: 'attachmentId', as: 'attachment' });
};

module.exports = Message;
