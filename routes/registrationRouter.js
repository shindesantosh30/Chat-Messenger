const express = require('express');
const { RegistrationController } = require('../controllers/signInOutController');

const router = express.Router();

router.post('/', RegistrationController.register);

module.exports = router;
