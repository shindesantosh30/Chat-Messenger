const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/authenticationController')

router.post('/', AuthController.forgetPassword);

module.exports = router;
