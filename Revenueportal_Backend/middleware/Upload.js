const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'public/videos')
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname + "_" + path.extname(file.originalname));
    }
})


const upload = multer({
    storage:storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB
    fileFilter: (req, file, callback) => {
        const allowedTypes = ['video/mp4', 'video/mpeg', 'video/avi'];
        if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error('Invalid file type'), false);
        }
    }
})

module.exports = upload;