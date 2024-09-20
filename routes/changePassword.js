const express = require('express');
const AuthController = require('../controllers/authenticationController')

const router = express.Router();

router.post('/', AuthController.changePassword)

module.exports = router;
