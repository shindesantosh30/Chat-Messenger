
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authGuard = async (request, response, next) => {
    try {
        const token = request.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            return response.status(401).json({ error: 'Authentication credentials were not provided.' });
        }

        const authToken = token.split(' ')[1];
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return response.status(400).json({ error: 'Invalid username or password' });
        }

        request.user = user;
        next();

    } catch (error) {
        console.error('Error:', error.message);
        return response.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = authGuard;
