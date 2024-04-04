const { getPaginationResponse } = require('../utillity/utils');
const User = require('../models/users');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    console.log("..................................... ",);
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized request' });
    }
    try {
        const decoded = jwt.verify(token, 'access_token');
        req.user = decoded.userId;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized request' });
    }
}

const { Op } = require('sequelize');

class UserController {
    static async list(request, response) {
        try {
            const { userId } = request.query;
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
