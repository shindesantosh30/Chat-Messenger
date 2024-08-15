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
                attributes: { exclude: ['password', 'updatedAt'] }
            });

            const data = getPaginationResponse(queryset, request);
            data.code = 200; // Set status code

            response.json(data);
        } catch (error) {
            console.error('Error fetching user list:', error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = UserController;
