const multer = require("multer");

const storage = multer.diskStorage({
  // armazenamento
  destination: (req, file, callback) => {
    callback(null, "./public/images");
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now().toString()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, callback) => {
  // tipo de imagem aceitas
  const isAccepted = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/webp",
  ].find((acceptedFormat) => acceptedFormat == file.mimetype);

  if (isAccepted) {
    return callback(null, true);
  }

  return callback(null, false);
};

module.exports = multer({
  storage,
  fileFilter,
});
