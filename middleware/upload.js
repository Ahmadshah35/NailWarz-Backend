const multer = require("multer")

const userStorage = multer.diskStorage({
  destination: "./uploads/user",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const userUpload = multer({
  storage: userStorage,
});

const postStorage = multer.diskStorage({
  destination: "./uploads/post",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const postUpload = multer({
  storage: postStorage,
});

const adminStorage = multer.diskStorage({
  destination: "./uploads/admin",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const adminUpload = multer({
  storage: adminStorage,
});


const technicianStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/technician"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const technicianUpload = multer({ storage: technicianStorage });


const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/service"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const serviceUpload = multer({ storage: serviceStorage });


module.exports ={
  userUpload,
  postUpload,
  technicianUpload,
  adminUpload,
  serviceUpload
}
