const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const States = sequelize.define('States', {
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    id_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
}, {
    indexes: [
        {
            fields: ['name'],
        },
    ],
});

module.exports = States;
