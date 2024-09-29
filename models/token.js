const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')
const User = require('./users');


const Token = sequelize.define('Token', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  accessToken: {
    type: DataTypes.STRING(512),
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.STRING(512),
    allowNull: false
  },
  accessTokenExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  refreshTokenExpiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Tokens',
  timestamps: true
});

// Establish relationships
Token.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Token, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Token;
