import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // folder where files will be saved
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname);
  }
});

export const upload = multer({
    storage: storage  // or storage,
})