// import express from "express";
import auth from "../middleware/auth";
import authtest from "../middleware/authtest";

import upload from "../utils/s3";
const express = require("express");
const router = express.Router();

import Activity from "../models/Activity";
import Character from "../models/Character";

const moment = require("moment");

/**
 *  @route Post activity/new
 *  @desc create new activity
 *  @access Public
 */
router.post("/new", upload.single("activityImage"), auth, async (req, res) => {
  const time = moment();
  var activityUpdateTime = time.format("YYYYMMDDHHmmss");
  const {
    activityContent,
    activityYear,
    activityMonth,
    activityDay,
    characterIndex,
  } = req.body;
  var activityIndex = 0;

  try {
    // 캐릭터 인덱스에 해당하는 캐릭터 불러옴 -> array
    const lastActivity = await Character.find(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      { _id: false, activity: true }
    );
    const activityCount = lastActivity[0]["activity"].length;

    // 만약, 캐릭터의 activity가 비어있다면 activityIndex를 1로 설정해줌
    if (activityCount == 0) {
      activityIndex = 1;
      console.log(
        "첫 게시글입니다, activityIndex를 ",
        activityIndex,
        "(으)로 설정했습니다."
      );
    } else {
      // 그렇지 않으면 lastActivity에 담겨있는 것들중에서 제일 마지막 것의 인덱스를 lastIndex에 담아줌
      const lastIndex = activityCount - 1;
      activityIndex =
        lastActivity[0]["activity"][lastIndex]["activityIndex"] + 1;
      console.log("activityIndex를 ", activityIndex, "(으)로 설정했습니다.");
    }

    var activityImage = "";
    var activityImageName = "";
    if (req.file) {
      activityImage = req.file.location;
      activityImageName = req.file.key;
    }

    const newActivity = {
      user_id: req.body.user.id,
      activityIndex: activityIndex,
      activityContent: activityContent,
      activityImage: activityImage,
      activityYear: activityYear,
      activityMonth: activityMonth,
      activityDay: activityDay,
      characterIndex: characterIndex,
      activityImageName: activityImageName,
    };

    const activityAdded = new Activity({
      user_id: req.body.user.id,
      activityIndex: activityIndex,
      activityContent: activityContent,
      activityImage: activityImage,
      activityYear: activityYear,
      activityMonth: activityMonth,
      activityDay: activityDay,
      characterIndex: characterIndex,
      activityImageName: activityImageName,
    });

    await Character.findOneAndUpdate(
      { characterIndex: characterIndex },
      { $push: { activity: newActivity } }
    );
    await Character.findOneAndUpdate(
      { characterIndex: characterIndex },
      {
        ResentActivityTime: activityUpdateTime,
        activityCount: activityCount + 1,
      }
    );

    await activityAdded.save();

    console.log("new activity 생성 완료 --");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "게시글 생성 성공",
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
 *  @route Post activity/edit
 *  @desc edit new activity
 *  @access Public
 */
router.post("/edit", upload.single("activityImage"), auth, async (req, res) => {
  const time = moment();
  var activityUpdateTime = time.format("YYYYMMDDHHmmss");
  const {
    activityContent,
    activityYear,
    activityMonth,
    activityDay,
    characterIndex,
    activityIndex,
  } = req.body;

  try {
    // 캐릭터 인덱스에 해당하는 캐릭터 불러옴 -> array
    const objectActivity = await Activity.find({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
      activityIndex: activityIndex,
    });

    // 이미지를 새로 업로드하지 않는 경우에는 기존 이미지 값을 가져온다.
    var activityImage = objectActivity[0]["activityImage"];
    var activityImageName = objectActivity[0]["activityImageName"];
    if (req.file) {
      activityImage = req.file.location;
      activityImageName = req.file.key;
    }
    console.log("자자 테스트를 해봅시다~ ", activityImage, activityImageName);

    // 수정할 값들을 바탕으로 데이터를 수정해준다.
    await Activity.findOneAndUpdate(
      {
        user_id: req.body.user.id,
        characterIndex: characterIndex,
        activityIndex: activityIndex,
      },
      {
        user_id: req.body.user.id,
        activityIndex: objectActivity[0].activityIndex,
        activityContent: activityContent,
        activityImage: activityImage,
        activityYear: activityYear,
        activityMonth: activityMonth,
        activityDay: activityDay,
        characterIndex: objectActivity[0].characterIndex,
        activityImageName: activityImageName,
      }
    );

    // Character 컬렉션에 추가하기 위해 새로 activity를 find 해준다.
    const activityForPush = await Activity.find({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
    });
    // Character에 수정된 activity 데이터들로 바꿔준다.
    await Character.findOneAndUpdate(
      { characterIndex: characterIndex },
      { activity: activityForPush }
    );

    await Character.findOneAndUpdate(
      { characterIndex: characterIndex },
      {
        ResentActivityTime: activityUpdateTime,
      }
    );

    console.log("activity 수정 완료 --");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "게시글 수정 성공",
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
