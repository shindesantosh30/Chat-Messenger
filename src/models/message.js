const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./user');

const Message = sequelize.define('Message', {
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    from_: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    to_: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
    }
});

Message.belongsTo(User, { foreignKey: 'from_' });
Message.belongsTo(User, { foreignKey: 'to_' });

module.exports = Message;
