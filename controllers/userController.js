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
            response.json(data);
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = UserController;
