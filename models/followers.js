const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require("../models/users");


const Follower = sequelize.define("Follower", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
}, {
    tableName: "Followers",
    timestamps: true,
    underscored: false
});

User.belongsToMany(User, {
    through: Follower, as: 'Followers', foreignKey: 'userId', otherKey: 'followerId'
});

User.belongsToMany(User, {
    through: Follower, as: 'Following', foreignKey: 'followerId', otherKey: 'userId'
});

module.exports = Follower;