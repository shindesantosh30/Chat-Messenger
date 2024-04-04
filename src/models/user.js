  const { DataTypes } = require('sequelize');
  const sequelize = require('../../config/database');
  
  const Role = require('./roles');
  const Address = require('./address');
  const Companies = require('./companies');


  const User = sequelize.define('User', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
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
    mobile_number: {
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
      defaultValue: 'active', // Set the default value to 'active'
    },
    isSuperAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Role, // Reference the Role model
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
        model: Address, // Reference the Address model
        key: 'id',
        onDelete: 'SET NULL', // This specifies the ON DELETE behavior
      },
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
        fields: ['username'],
      },
      {
        fields: ['status'],
      },
    ],
  });

  User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' }); // Define the association
  User.belongsTo(Address, { foreignKey: 'address_id', as: 'address' }); // Define the association
  User.belongsTo(Companies, { foreignKey: 'company_id', as: 'company' });

  module.exports = User;
