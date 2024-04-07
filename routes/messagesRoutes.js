const express = require('express');
const { update, list, remove, retrieve } = require('../controllers/messagesController');

const router = express.Router();

router.get('/', list);

router.put('/:id', update);

router.delete('/:id', remove);

router.get('/:id', retrieve);

// router.post('/', create);

module.exports = router;