const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Group = require('./groups');
const User = require('./users');
const Asset = require('./assets');

const GroupMessage = sequelize.define('GroupMessage', {
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
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isEdited: {
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'GroupMessages',
    timestamps: true,
    indexes: [
        {
            fields: ['groupId'],
        },
        {
            fields: ['senderId'],
        },
    ],
});

// Associations
GroupMessage.belongsTo(Group, { foreignKey: 'groupId' });
GroupMessage.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
GroupMessage.belongsTo(Asset, { foreignKey: 'attachmentId', as: 'attachment' });

module.exports = GroupMessage;
