import path from "path";

const multer = require("multer");
// const multerS3 = require("multer-s3");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");
const AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + "/../../awsconfig.json");
let s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "catchmeserver",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: true,
    transforms: [
      {
        id: "resized",
        key: function (req, file, cb) {
          cb(null, `uploads/${Date.now()}_${file.originalname}`);
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(400, 400));
        },
      },
    ],
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
      console.log(file);
    },
    acl: "public-read-write",
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
});

export default upload;
