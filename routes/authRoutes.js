const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('./verifyToken'); // Import verifyToken middleware

router.post('/register', authController.register);
router.post('/login', authController.login);
// Protected route example
router.get('/protected-route', verifyToken, (req, res) => {
    // This route is protected by verifyToken middleware
    res.status(200).send('Protected route accessed successfully');
});

module.exports = router;
