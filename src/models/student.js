const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Student = sequelize.define('student', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    roll_no: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Student;
