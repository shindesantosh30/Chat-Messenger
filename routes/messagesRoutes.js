const express = require('express');
const { list } = require('../controllers/messagesController');

const router = express.Router();

router.get('/', list);

module.exports = router;