const express = require('express');
const { list } = require('../controllers/userController');

const router = express.Router();

router.get('/', list);

module.exports = router;