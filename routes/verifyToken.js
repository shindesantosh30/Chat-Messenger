const jwt = require('jsonwebtoken');
const jwtSecret = '6501ce7681ec09e814efe76fe4be8257dd8b54c021688ab020bcf5ce4714dd44';

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized request');
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        console.log("decoded ",decoded);
        req.user = decoded.userId; // Attach user ID to request object
        next(); // Call next middleware
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).send('Unauthorized request');
    }
}

module.exports = verifyToken;


// const crypto = require('crypto');
// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log("Generated secret key:", secretKey);

