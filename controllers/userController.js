const { getPaginationResponse } = require('../utillity/utils');
const User = require('../models/users');
const { Op } = require('sequelize');


class UserController {
    static async list(request, response) {
        try {
            const userId = request.user.id;

            const queryset = await User.findAll({
                where: {
                    id: { [Op.ne]: userId }
                },
                attributes: { exclude: ['password', 'updatedAt', 'socketId',] }
            });

            const data = getPaginationResponse(queryset, request);
            data.code = 200; // Set status code

            response.json(data);
        } catch (error) {
            console.error('Error fetching user list:', error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }

    static async retrieve(request, response) {
        try {
            const { id } = request.params;
            const instance = await User.findByPk(id, {
                attributes: { exclude: ['password', 'updatedAt'] }
            });
            if (!instance) {
                return response.status(404).json({ "message": "User not found" });
            }
            instance['code'] = 200;

            return response.json(instance);
        } catch (error) {
            console.error('Error fetching user list:', error);
            return response.status(500).json({ message: 'Internal server error' });
        }
    }
}


async function updateSocketID(userId, socketId) {
    try {
        await User.update({ socketId: socketId, isOnline: true }, { where: { id: userId } });
    } catch (error) {
        console.error('Error updating socketId:', error);
        throw new Error('Failed to update socketId');
    }
}

async function updateUsersOnlineStatus(user) {
    try {
        const [updated] = await User.update(
            {
                isOnline: false,
                lastSeen: new Date(),
            },
            { where: { id: user.id } }
        );

        if (updated) {
            const updatedUser = await User.findByPk(user.id, {
                attributes: ['id', 'isOnline', 'lastSeen'],
            });
            return updatedUser;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error updating online status:', error);
        throw new Error('Failed to update online status');
    }
}


module.exports = {
    UserController,
    updateSocketID,
    updateUsersOnlineStatus
};
