const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

AWS.config.loadFromPath(__dirname + "/../../awsconfig.json"); // 인증

let s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "catchmeserver",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read-write",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      console.log("s3에서 !!!!!!@@@@@@@@@@@@@@@@", req.hello);
      // if (!req.body.isAuth){
      //   cb(null, false);
      // } else
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
});

export default upload;
