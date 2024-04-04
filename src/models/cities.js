const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const States = require('./states');

const Cities = sequelize.define('Cities', {
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    id_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
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

Cities.belongsTo(States, { foreignKey: 'state_id', as: 'state' }); // Define the association

module.exports = Cities;
