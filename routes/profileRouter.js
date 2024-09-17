const express = require('express')
const ProfileController = require('../controllers/profileController')

const router = express.Router()

router.put('/:id', ProfileController.updateProfile)
router.get('/', ProfileController.getProfile)

module.exports = router;
