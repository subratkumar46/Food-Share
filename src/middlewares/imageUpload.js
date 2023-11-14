const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../public/uploads/"),
    filename: (req, file, cbFun) => {
        cbFun(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

module.exports = multer({
    storage: storage
}).single('image');