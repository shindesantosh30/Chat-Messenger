const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Asset = sequelize.define('Asset', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fileName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fileSize: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    mimeType: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'assets',
    timestamps: true,
    underscored: true
});

module.exports = Asset;
