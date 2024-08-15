const express = require('express');
const { MessageController } = require('../controllers/messagesController');

const router = express.Router();

router.get('/', MessageController.list);

router.put('/:id', MessageController.update);

router.delete('/:id', MessageController.remove);

router.get('/:id', MessageController.retrieve);

// router.post('/', create);

module.exports = router;