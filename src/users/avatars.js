import multer from "multer"
import path from "path"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars');
    },
    filename: function (req, file, cb) {
        const prefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, prefix + file.originalname);
    }
});
function fileFilter(req, file, cb) {
    const allowedFiles = ['.jpg', '.jpeg', '.png']
    if (allowedFiles.includes(path.extname(file.originalname).toLowerCase())) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, fileFilter })

export default upload