const express = require('express');
const router = express.Router();

const FollowersController = require('../controllers/followingFollowersController');

router.get('/', FollowersController.list)

module.exports = router;