import auth from "../middleware/auth";
import upload from "../utils/s3";
const express = require("express");
const router = express.Router();

router.post("/", auth, upload.single("image"), function (req, res, next) {
  try {
    console.log(req.file);
    console.log(req.body);

    res.json({
      status: 200,
      success: true,
      message: " 용켸.성공.하셧웁니댜 ^00^ ??",
      data: {
        text: req.body.text,
        image: req.file.location,
        contentType: req.file.contentType,
      },
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  }
});

module.exports = router;
