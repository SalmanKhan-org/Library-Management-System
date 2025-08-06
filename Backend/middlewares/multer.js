const multer = require('multer');

// store file in memory so we can stream to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 5MB limit (optional)
  },
});

module.exports = upload;
