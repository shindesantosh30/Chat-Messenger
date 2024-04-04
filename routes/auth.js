// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// router.post('/register', authController.register);
// router.post('/login', authController.login);

// module.exports = router;


const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('./verifyToken');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/protected-route', verifyToken, (req, res) => {
    // This route is protected by verifyToken middleware
    res.status(200).send('Protected route accessed successfully');
});

module.exports = router;
