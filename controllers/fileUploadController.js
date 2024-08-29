const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Asset = require('../models/assets');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../media/static/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.uploadFile = (req, res) => {
  upload.single('file')(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Attachment is required" });
    }

    const { originalname, path: absolutePath, size, mimetype } = req.file;
    const relativePath = path.relative(process.cwd(), absolutePath);
    const fullUrl = `${req.protocol}://${req.get('host')}`;

    try {
      const fileInstance = await Asset.create({
        fileName: originalname,
        filePath: relativePath,
        fileSize: size,
        mimeType: mimetype
      });

      res.status(200).json({
        message: 'File uploaded successfully',
        id: fileInstance.id,
        filePath: relativePath,
        fileSize: formatFileSize(size),
        fileName: originalname,
        mimeType: mimetype,
        status_code: 200
      });
    } catch (dbError) {
      console.log("Error uploading file: ", dbError);
      res.status(500).json({ error: dbError.message });
    }
  });
};

const formatFileSize = (bytes) => {
  const BYTES_IN_KB = 1024;
  const BYTES_IN_MB = 1048576;
  const BYTES_IN_GB = 1073741824;
  if (bytes < BYTES_IN_KB) { return `${bytes} Bytes`; }
  if (bytes < BYTES_IN_MB) { return `${(bytes / BYTES_IN_KB).toFixed(2)} KB`; }
  if (bytes < BYTES_IN_GB) { return `${(bytes / BYTES_IN_MB).toFixed(2)} MB`; }

  return `${(bytes / BYTES_IN_GB).toFixed(2)} GB`;
};
