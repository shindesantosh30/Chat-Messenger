const express = require('express');
const router = express.Router();

const GroupsController = require('../controllers/groupsController');

router.get('/', GroupsController.get)

router.get('/:id', GroupsController.getById)

router.put('/:id', GroupsController.put)

router.post('/', GroupsController.post)

router.delete('/:id', GroupsController.delete)

router.delete('/', GroupsController.deleteAll)

module.exports = router;