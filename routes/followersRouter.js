const express = require('express');
const router = express.Router();

const FollowersController = require('../controllers/followingFollowersController');

router.get('/', FollowersController.list)

router.get('/:id', FollowersController.retrieve)

router.post('/', FollowersController.create)

module.exports = router;