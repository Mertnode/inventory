const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // Dosya adında boşluk veya çizgi içerebilmesi için bir düzenleme yapın
    const originalname = file.originalname.replace(/\s+/g, '_'); // Boşlukları alt çizgi ile değiştirir
    const newFilename = path.parse(originalname).name + '-' + uniqueSuffix + path.extname(originalname);
    
    cb(null, newFilename);
  }
});

function fileFilter(req, file, cb) {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG files are allowed.'));
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
