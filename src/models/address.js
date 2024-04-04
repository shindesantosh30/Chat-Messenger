const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const States = require('./states');
const Cities = require('./cities');


const Addresses = sequelize.define('Addresses', {
    area: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    street: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    zipcode: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    city_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Cities, // Reference the Cities model
            key: 'id',
            onDelete: 'SET NULL', // This specifies the ON DELETE behavior
        },
    },
    state_id: {
        type: DataTypes.INTEGER,
        references: {
            model: States, // Reference the States model
            key: 'id',
            onDelete: 'SET NULL', // This specifies the ON DELETE behavior
        },
    },
}, {
    indexes: [
        {
            fields: ['name'],
        },
    ],
});

Addresses.belongsTo(Cities, { foreignKey: 'city_id', as: 'city' }); // Define the association
Addresses.belongsTo(States, { foreignKey: 'state_id', as: 'state' }); // Define the association

module.exports = Addresses;
