import multer from "multer";
import path from "path";

const tempDir = path.join(process.cwd(), "temp");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({storage});

export default upload;
