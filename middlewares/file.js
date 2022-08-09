const multer = require("multer");
const upload = multer({});

exports.uploadFile = upload.single('file');