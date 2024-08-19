const express = require('express');
const router = express.Router();
const fileUploadController = require('../controllers/fileUploadController');

router.post('/', fileUploadController.uploadFile);

module.exports = router;
