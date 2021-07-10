// import express from "express";
import auth from "../middleware/auth";
import upload from "../utils/s3";
const express = require("express");
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

  const lastActivity = await Activity.find({
    characterIndex: req.body.characterIndex,
  }).sort({ _id: -1 });
  console.log(lastActivity);

  // var activityIndex = lastActivity[0]["activityIndex"] + 1;
  let activityIndex = 1;
  if (lastActivity.length) {
    activityIndex = lastActivity[0]["activityIndex"] + 1;
  }
  var activityDate = time.format("YYYYMMDDHHmmss");

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
      data: newActivity,
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
router.post("/test", upload.single("activityImage"), auth, async (req, res) => {
  // router.post("/test", auth, async (req, res) => {
  console.log(
    "req.body.user.id",
    req.body.user.id,
    "req.body.characterIndex",
    req.body.data.characterIndex,
    "activityContent",
    req.body.data.activityContent
  );
  console.log("req.body", req.body);
  console.log("req.body.data", req.body.data);
  console.log("req.file", req.file);

  const time = moment();
  const {
    activityContent,
    activityYear,
    activityMonth,
    activityDay,
    characterIndex,
  } = req.body;

  const lastActivity = await Activity.find({
    user_id: req.body.user.id,
    characterIndex: req.body.data.characterIndex,
  })
    .sort({ _id: -1 })
    .select({ _id: 0 });

  if (lastActivity.length == 0) {
    console.log("해당 데이터가 없습니다. 불러올 수 없습니다.");
    res.status(400).json({
      status: 400,
      success: false,
      message: "데이터가 비어있습니다.",
    });
  }

  // console.log("출력시도", lastActivity);
  var activityDate = time.format("YYYYMMDDHHmmss");

  var activityIndex = lastActivity[0]["activityIndex"] + 1;
  console.log("activityIndex check ", activityIndex);

  try {
    const newActivity = new Activity({
      user_id: req.body.user.id,
      activityIndex: activityIndex,
      activityContent: activityContent,
      activityImage: req.file.location,
      activityYear: activityYear,
      activityMonth: activityMonth,
      activityDay: activityDay,
      characterIndex: characterIndex,
    });

    await newActivity.save();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "캐릭터 생성 성공",
      data: {
        newActivity,
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

router.post("/upload", upload.single("image"), auth, async (req, res, next) => {
  try {
    console.log(req.file);
    console.log(req.body);

    const {
      activityContent,
      activityYear,
      activityMonth,
      activityDay,
      characterIndex,
    } = req.body;

    const lastActivity = await Activity.find({
      user_id: req.body.user.id,
      characterIndex: req.body.characterIndex,
    })
      .sort({ _id: -1 })
      .select({ _id: 0 });

    var activityIndex = lastActivity[0]["activityIndex"] + 1;

    const newActivity = new Activity({
      user_id: req.body.user.id,
      activityIndex: activityIndex,
      activityContent: activityContent,
      activityImage: req.file.location,
      activityYear: activityYear,
      activityMonth: activityMonth,
      activityDay: activityDay,
      characterIndex: characterIndex,
    });

    await newActivity.save();

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
