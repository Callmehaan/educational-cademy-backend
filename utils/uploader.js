const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

module.exports = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "public", "courses", "covers"));
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + String(Math.random() * 9999);
        // const hashedFileName = crypto
        //     .createHash("SHA256")
        //     .update(file.originalname)
        //     .digest("hex"); //this code makes another way to create a filename with hash method
        const ext = path.extname(file.originalname);

        cb(null, fileName + ext);
    },
});
