import { check, validationResult } from "express-validator";
import upload from '../utils/s3'
const express = require('express');
const router = express.Router();

router.post('/', upload.single("image"), function(req, res, next){
  const errors = validationResult(req);

  if (!errors.isEmpty()){
    return res.status(400).json({ 
      "status" : 400,
      "success" : false,
      "message" : "다시 하세요. 아쉽습니다.",
      "data" : null
    });
  }

  res.json({
    "status" : 200,
    "success" : true,
    "message" : " 용켸.성공.하셧웁니댜 ^00^ ??",
    "data" : {
      "text" : req.body.text,
      "image" : req.file.location
    }
  });
});

module.exports = router