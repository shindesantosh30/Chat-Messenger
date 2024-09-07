const express = require('express');
const router = express.Router();
const { uploadFile, deleteFile } = require('../controllers/fileUploadController');

router.post('/', uploadFile);
router.delete('/:id', deleteFile);

module.exports = router;
