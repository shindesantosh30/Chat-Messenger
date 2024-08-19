const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Asset = require('../models/assets');


// Define storage options for multer
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    // Set the destination folder for uploaded files
    const uploadPath = path.join(__dirname, '../media/static/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (request, file, cb) {
    // Set the file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create multer instance with storage options
const upload = multer({ storage: storage });

exports.uploadFile = (request, response) => {
  // Use multer to handle the file upload
  upload.single('file')(request, response, async function (err) {
    if (err) {
      return response.status(500).json({ error: err.message });
    }

    // Extract file details
    const { originalname, path: filePath, size, mimetype } = request.file;

    try {
      const fileInstance = await Asset.create({
        fileName: originalname,
        filePath: filePath,
        fileSize: size,
        mimeType: mimetype
      });

      response.status(200).json({
        message: 'File uploaded successfully',
        id: fileInstance.id,
        fileName: fileInstance.fileName,
        status_code: 200
      });
    } catch (dbError) {
      response.status(500).json({ error: dbError.message });
    }
  });
};
