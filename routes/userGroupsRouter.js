const express = require('express');
const router = express.Router();

const GroupUsersController = require('../controllers/groupUsers');

router.get('/', GroupUsersController.get)

router.get('/:id', GroupUsersController.getById)

router.put('/:id', GroupUsersController.put)

router.post('/', GroupUsersController.post)

router.delete('/:id', GroupUsersController.delete)

router.delete('/', GroupUsersController.deleteAll)

module.exports = router;