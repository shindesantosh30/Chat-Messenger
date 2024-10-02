const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require("./users");

const REQUEST_STATUS_CHOICES = {
    PENDING: 1,
    ACCEPTED: 2,
    REJECTED: 3,
};

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
    requestStatus: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isIn: [[REQUEST_STATUS_CHOICES.PENDING, REQUEST_STATUS_CHOICES.ACCEPTED, REQUEST_STATUS_CHOICES.REJECTED]],
        },
        defaultValue: REQUEST_STATUS_CHOICES.PENDING
    },
    isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    unfollowedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: "Followers",
    timestamps: true,
    underscored: false
});

Follower.prototype.getRequestStatusDisplay = function () {
    const REQUEST_STATUS_DISPLAY = {
        1: "Pending",
        2: "Accepted",
        3: "Rejected"
    };
    return REQUEST_STATUS_DISPLAY[this.requestStatus] || "Unknown";
};

Follower.belongsTo(User, { foreignKey: 'userId', as: 'User' });
Follower.belongsTo(User, { foreignKey: 'followerId', as: 'FollowerUser' });

function to_dict(instance) {
    if (!instance) return null;

    return {
        userId: instance.userId,
        followerId: instance.followerId,
        requestStatus: instance.requestStatus,
        isBlocked: instance.isBlocked,
        unfollowedAt: instance.unfollowedAt,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt
    };
}

module.exports = {
    Follower,
    to_dict
};
