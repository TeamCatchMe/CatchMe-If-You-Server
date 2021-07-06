const multer = require("multer");
const multerS3 = require('multer-s3');
const AWS = require("aws-sdk");


AWS.config.loadFromPath(__dirname + "/../../awsconfig.json"); // 인증
let s3 = new AWS.S3();

const upload = multer({

    storage: multerS3({
        s3: s3,
        bucket: "catchmeserver",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: function (req, file, cb) {
          console.log(file);
          cb(null, file.originalname)
        },
    })

})

export default upload;