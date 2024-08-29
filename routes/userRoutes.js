const express = require('express');
const { UserController } = require('../controllers/userController');

const router = express.Router();

router.get('/', UserController.list);

router.get('/:id', UserController.retrieve);

module.exports = router;