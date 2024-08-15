const express = require('express')
const ProfileController = require('../controllers/profileController')

const router = express.Router()

router.put('/', ProfileController.updateProfile)

module.exports = router;
