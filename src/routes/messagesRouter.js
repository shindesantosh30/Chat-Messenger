const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.get('/:id', messageController.retrieve);
router.get('/', messageController.list);

module.exports = router;
