const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const GroupMessageReadStatus = sequelize.define('GroupMessageReadStatus', {
    groupMessageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'GroupMessages',
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'GroupMessageReadStatuses',
    timestamps: true,
});


module.exports = GroupMessageReadStatus;
