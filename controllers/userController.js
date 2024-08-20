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

    static async retrieve(request, response) {
        try {
            const { id } = request.params; // Destructure the ID from the request params
            console.log("PARAMS 🚀 ", id);

            // Fetch user instance by primary key
            const instance = await User.findByPk(id, {
                attributes: { exclude: ['password', 'updatedAt'] }
            });
            if (!instance) {
                return response.status(404).json({ "message": "User not found" });
            }

            instance['code'] = 200; // Set status code on the instance (if you need this field in the response)

            return response.json(instance); // Send the user data as a JSON response
        } catch (error) {
            console.error('Error fetching user list:', error);
            return response.status(500).json({ message: 'Internal server error' }); // Handle errors
        }
    }
}

module.exports = UserController;
