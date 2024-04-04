const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Companies = sequelize.define('Companies', {
    company_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false, // Enforce uniqueness for email addresses
        validate: {
            isEmail: true, // Validate the email format
        },
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'pending'),
        allowNull: false,
        defaultValue: 'active',
    },
    cin_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gst_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    registration_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    website_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    indexes: [
        {
            unique: false, // Enforce uniqueness for email addresses
            fields: ['email'],
        },
        {
            fields: ['mobile_number'],
        },
        {
            fields: ['status'],
        },
        {
            fields: ['username'],
        },
        {
            fields: ['gst_number'],
        },
        {
            fields: ['cin_number'],
        },
    ],
});


module.exports = Companies;
