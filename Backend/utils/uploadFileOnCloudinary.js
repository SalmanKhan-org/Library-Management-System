const cloudinary = require('./cloudinary');

const uploadFile = async (file) => {
  if (!file) throw new Error('No file provided');

  const baseName = file.originalname.split('.')[0].trim(); // trim here
  const publicId = `${Date.now()}-${baseName}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'library-system',
        public_id: publicId,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    ).end(file.buffer);
  });
};

module.exports = uploadFile;