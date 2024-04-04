const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // Import the Sequelize instance

const Teacher = sequelize.define('teacher', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING,
        allowNull: true
    },
    salary: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
});

module.exports = Teacher;
