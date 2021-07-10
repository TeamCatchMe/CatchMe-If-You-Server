// import express from "express";
import auth from "../middleware/auth";
import upload from "../utils/s3";
const express = require('express');
const router = express.Router();

import Activity from "../models/Activity";
import Character from "../models/Character";

const moment = require("moment");

/**
 *  @route Post user/activity/add
 *  @desc create new activity
 *  @access Public
 */

//updateOne, image 업로드

router.post("/add", auth, async (req, res) => {
  console.log(req.body.user.id);
  const time = moment();
  const { activityContent } = req.body;
  const characterIndex = req.body.user.id;

  const lastActivity = await Activity.find({characterIndex : req.body.characterIndex}).sort({_id:-1});
  console.log(lastActivity);


  // var activityIndex = lastActivity[0]["activityIndex"] + 1;
  let activityIndex = 1; 
  if ( lastActivity.length ) {
      activityIndex = lastActivity[0]["activityIndex"]+1;
  }
  var activityDate = time.format('YYYYMMDDHHmmss');
  
  try {
    const newActivity = new Activity({
      user_id: req.body.user.id,
      activityIndex: activityIndex,
      activityContent: activityContent,
      // activityImage: req.body.file.location,
      activityDate: activityDate,
      characterIndex: characterIndex,
    });

    await newActivity.save();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "게시글 생성 성공",
      data : newActivity
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

/**
 *  @route Post user/activity/test
 *  @desc create new activity test
 *  @access Public
 */

// 모델 테스트
router.post("/test", auth, async (req, res) => {
  const { activityContent, activityDate, activityImage, characterIndex } =
    req.body;

  const lastActivity = await Activity.find({
    user_id: req.body.user.id,
    characterIndex: req.body.characterIndex,
  })
    .sort({ _id: -1 })
    .select({ _id: 0 });

  console.log("출력시도", lastActivity);
  const time = moment();
  console.log(time);
  var activityIndex = lastActivity[0]["activityIndex"] + 1;
  console.log("activityIndex check ", activityIndex);

  try {
    const newActivity = new Activity({
      user_id: req.body.user.id,
      activityIndex: activityIndex,
      activityContent: activityContent,
      activityImage: activityImage,
      activityDate: activityDate,
      characterIndex: characterIndex,
    });

    await newActivity.save();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "캐릭터 생성 성공",
      data: {
        newActivity: newActivity,
        hello: "hello",
        lastActivity: [lastActivity],
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

module.exports = router;
