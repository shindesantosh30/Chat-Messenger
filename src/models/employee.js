const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./user');
const Address = require('./address');
const Companies = require('./companies');


const Employee = sequelize.define('Employee', {
    emp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Enforce uniqueness for emp_id addresses
    },
    adhar_card: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    pan_card: {
        type: DataTypes.STRING,
        allowNull: true
    },
    joining_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    birth_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User, // Reference the User model
            key: 'id',
            onDelete: 'SET NULL', // This specifies the ON DELETE behavior
        },
    },
    company_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Companies, // Reference the Companies model
            key: 'id',
            onDelete: 'SET NULL', // This specifies the ON DELETE behavior
        },
    },
    address_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Address,  // Reference the Address model
            key: 'id',
            onDelete: 'SET NULL', // This specifies the ON DELETE behavior
        },
    },
},
    {
        // Define indexes on the model
        indexes: [
            {
                unique: true, // Enforce uniqueness for email addresses
                fields: ['emp_id'],
            },
            {
                fields: ['adhar_card'],
            },
            {
                fields: ['pan_card'],
            },
        ],
    }
);

Employee.belongsTo(User, { foreignKey: 'user_id', as: 'employee_user' }); // Define the association
Employee.belongsTo(Address, { foreignKey: 'address_id', as: 'employee_address' }); // Define the association
User.belongsTo(Companies, { foreignKey: 'company_id', as: 'employee_company' }); // Define the association

module.exports = Employee;
