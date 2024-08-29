const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./users');

const ContactUsers = sequelize.define('ContactUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    contactId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    }
}, {
    tableName: 'ContactUsers',
    timestamps: true,
});

// Define associations
ContactUsers.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ContactUsers.belongsTo(User, { foreignKey: 'contactId', as: 'contact' });

module.exports = ContactUsers;
