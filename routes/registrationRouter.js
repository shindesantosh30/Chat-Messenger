const express = require('express');
const { RegistrationController } = require('../controllers/authController');

const router = express.Router();

router.post('/', RegistrationController.register);

module.exports = router;
