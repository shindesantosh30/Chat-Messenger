const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./users');

const UserSettings = sequelize.define("UserSettings", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,  // Ensure each user has only one settings record
        references: {
            model: User,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    showTypingIndicator: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,  // Show typing indicator by default
    },
    showOnlineStatus: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,  // Show online status by default
    },
    pushNotifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,  // Enable push notifications by default
    },
    theme: {
        type: DataTypes.ENUM('light', 'dark'),
        defaultValue: 'light',  // Default theme is light
    },
    lastSeenVisibility: {
        type: DataTypes.ENUM('everyone', 'contacts', 'nobody'),
        defaultValue: 'everyone',  // Control who can see last seen status
    },
    profileVisibility: {
        type: DataTypes.ENUM('everyone', 'followers', 'nobody'),
        defaultValue: 'everyone',  // Control who can view the profile
    },
    readReceipts: {
        type: DataTypes.ENUM('everyone', 'followers', 'nobody'),
        defaultValue: 'everyone',  // Control who can see read receipts
    },
    statusVisibility: {
        type: DataTypes.ENUM('everyone', 'contacts', 'nobody'),
        defaultValue: 'everyone',  // Control who can view status updates
    },
}, {
    tableName: "UserSettings",
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

// Set up a One-to-One relationship between User and UserSettings
User.hasOne(UserSettings, { foreignKey: 'userId', as: 'settings' });
UserSettings.belongsTo(User, { foreignKey: 'userId' });

// Function to convert UserSettings instance to plain object
function to_dict(instance) {
    if (!instance) return null;
    
    return {
        userId: instance.userId,
        isPrivate: instance.isPrivate,
        showTypingIndicator: instance.showTypingIndicator,
        showOnlineStatus: instance.showOnlineStatus,
        pushNotifications: instance.pushNotifications,
        theme: instance.theme,
        lastSeenVisibility: instance.lastSeenVisibility,
        profileVisibility: instance.profileVisibility,
        readReceipts: instance.readReceipts,
        statusVisibility: instance.statusVisibility,
        createdAt: instance.createdAt,
        updatedAt: instance.updatedAt
    };
}

module.exports = {
    UserSettings,
    to_dict
};
