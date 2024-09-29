const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./users');


const ResetToken = sequelize.define('ResetToken', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    token: {
        type: DataTypes.STRING(512),
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'ResetTokens',
    timestamps: true
});

// Establish relationships
ResetToken.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(ResetToken, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = ResetToken;
