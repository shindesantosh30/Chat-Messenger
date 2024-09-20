const express = require('express');
const { LoginController } = require('../controllers/signInOutController');

const router = express.Router();

router.post('/', LoginController.login);

module.exports = router;
