const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Image upload configuration (existing functionality)
const imageFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
};

// Backup file upload configuration
const backupFileFilter = (req, file, cb) => {
  const filetypes = /json|csv|sql|xlsx|xls/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /application\/json|text\/csv|application\/sql|application\/vnd\.ms-excel|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only backup files (JSON, CSV, SQL, Excel) are allowed!');
  }
};

// Create separate multer instances
const imageUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
});

const backupUpload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for backup files
  fileFilter: backupFileFilter
});

// Export the original image upload for existing routes
const upload = imageUpload.single('image');

// Add additional methods
upload.single = imageUpload.single.bind(imageUpload);
upload.backup = backupUpload.single('file');

module.exports = upload;