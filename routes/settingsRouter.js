const express = require('express');
const router = express.Router();

const { SettingsController } = require('../controllers/settingsController');

router.get('/:id', SettingsController.retrieve)

router.put('/', SettingsController.update)

module.exports = router;