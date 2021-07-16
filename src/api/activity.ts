// import express from "express";
import auth from "../middleware/auth";
import upload from "../utils/s3";

const logger = require("../modules/logger");

const AWS = require("aws-sdk");
let s3 = new AWS.S3();
AWS.config.loadFromPath(__dirname + "/../../awsconfig.json");

const express = require("express");
const router = express.Router();

import Activity from "../models/Activity";
import Character from "../models/Character";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

/**
 *  @route Post activity/new
 *  @desc create new activity
 *  @access Public
 */
router.post("/new", upload.single("activityImage"), auth, async (req, res) => {
  const time = moment();
  var activityUpdateTime = time.format("YYYYMMDDHHmmss");
  var logTime = time.format("HH:mm:ss");

  const {
    activityContent,
    activityYear,
    activityMonth,
    activityDay,
    characterIndex,
  } = req.body;
  var activityIndex = 0;

  try {
    console.log(logger.TRY_ACTIVITY_NEW, "[", logTime, "]");
    // 캐릭터 인덱스에 해당하는 캐릭터 불러옴 -> array
    const lastActivity = await Character.find(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      { _id: false, activity: true }
    );

    const activityCount = lastActivity[0]["activity"].length;

    // 만약, 캐릭터의 activity가 비어있다면 activityIndex를 1로 설정해줌
    if (activityCount == 0) {
      activityIndex = 1;
    } else {
      const edittedActivity = await Activity.find({
        user_id: req.body.user.id,
        characterIndex: characterIndex,
      })
        .sort({ activityIndex: -1 })
        .limit(1);

      console.log(edittedActivity);

      console.log(
        "edittedActivity.activityIndex",
        edittedActivity[0]["activityIndex"]
      );
      activityIndex = edittedActivity[0]["activityIndex"] + 1;
    }

    var activityImage = "";
    var activityImageName = "";
    if (req.file) {
      activityImage = req.file.location;
      activityImageName = req.file.key;
    }

    const activityAdded = new Activity({
      user_id: req.body.user.id,
      activityIndex: activityIndex,
      activityContent: activityContent,
      activityImage: activityImage,
      activityYear: activityYear,
      activityMonth: activityMonth,
      activityDay: activityDay,
      recentActivityTime: activityUpdateTime,
      characterIndex: characterIndex,
      activityImageName: activityImageName,
    });

    const countAfterUpdate = activityCount + 1;
    await Character.findOneAndUpdate(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      {
        recentActivityTime: activityUpdateTime,
        activityCount: countAfterUpdate,
      }
    );

    console.log("[추가된 데이터] \n", activityAdded);

    await activityAdded.save();

    const edittedActivity = await Activity.find({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
    }).sort({ activityYear: -1, activityMonth: -1, activityDay: -1 });

    await Character.findOneAndUpdate(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      { activity: edittedActivity }
    );

    // 활동 기록 수를 확인하여 캐릭터 레벨업
    if (countAfterUpdate == 11) {
      await Character.findOneAndUpdate(
        { user_id: req.body.user.id, characterIndex: characterIndex },
        {
          characterLevel: 2,
        }
      );
      console.log(logger.ACTIVITY_LEVEL_UP_2, "[", logTime, "]");
      return res.status(222).json({
        status: 222,
        success: true,
        message:
          "게시물 등록 성공 && 캐릭터 레벨 업!!! 끼얏호오오~~ 레벨업이다!!",
      });
    } else if (countAfterUpdate == 31) {
      await Character.findOneAndUpdate(
        { user_id: req.body.user.id, characterIndex: characterIndex },
        {
          characterLevel: 3,
        }
      );
      console.log(logger.ACTIVITY_LEVEL_UP_3, "[", logTime, "]");
      return res.status(222).json({
        status: 222,
        success: true,
        message:
          "게시물 등록 성공 && 캐릭터 레벨 업!!! 끼얏호오오~~ 레벨업이다!!",
      });
    }

    console.log(logger.OK_ACTIVITY_NEW, "[", logTime, "]");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "게시글 생성 성공",
    });
  } catch (err) {
    console.log(logger.FAIL_ACTIVITY_NEW, "[", logTime, "]");
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
  var logTime = time.format("HH:mm:ss");

  const {
    activityContent,
    activityYear,
    activityMonth,
    activityDay,
    characterIndex,
    activityIndex,
  } = req.body;

  try {
    console.log(logger.TRY_ACTIVITY_EDIT, "[", logTime, "]");
    console.log("@@@@@@@@@@@@@@@수빈용 로그@@@@@@@@@@@@@@@");
    console.log("req.body", req.body, "req.body.user.id", req.body.user.id);

    // 캐릭터 인덱스에 해당하는 캐릭터 불러옴 -> array
    const objectActivity = await Activity.find({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
      activityIndex: activityIndex,
    });

    console.log("출력 되는 것인가?", objectActivity);

    // 이미지를 새로 업로드하지 않는 경우에는 기존 이미지 값을 가져온다.
    // var activityImage = objectActivity[0]["activityImage"];
    // var activityImageName = objectActivity[0]["activityImageName"];
    var activityImage = "";
    var activityImageName = "";

    if (req.file) {
      // 새로 이미지를 업데이트 하는경우 && 기존에 이미지가 업로드 되어있던 경우
      // 기존 이미지를 삭제하기 위해 기존 이미지의 이름을 찾아 imageKey에 저장한다
      if (objectActivity[0]["activityImageName"] != "") {
        const imageKey = objectActivity[0]["activityImageName"];

        // 서버에서 해당 이미지를 삭제한다.
        s3.deleteObject(
          {
            Bucket: "catchmeserver", // 사용자 버켓 이름
            Key: imageKey, // 버켓 내 경로
          },
          (err, data) => {
            if (err) {
              throw err;
            }
          }
        );
      }
      activityImage = req.file.location;
      activityImageName = req.file.key;
    }

    // 수정할 값들을 바탕으로 데이터를 수정해준다.
    await Activity.findOneAndUpdate(
      {
        user_id: req.body.user.id,
        characterIndex: characterIndex,
        activityIndex: activityIndex,
      },
      {
        activityContent: activityContent,
        activityImage: activityImage,
        activityYear: activityYear,
        activityMonth: activityMonth,
        activityDay: activityDay,
        activityImageName: activityImageName,
      }
    );

    // Character 컬렉션에 추가하기 위해 새로 activity를 find 해준다.
    const activityForPush = await Activity.find({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
    }).sort({ activityYear: -1, activityMonth: -1, activityDay: -1 });
    // Character에 수정된 activity 데이터들로 바꿔준다.
    await Character.findOneAndUpdate(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      { activity: activityForPush }
    );

    console.log("[수정된 데이터] \n", {
      user_id: req.body.user.id,
      activityIndex: objectActivity[0].activityIndex,
      activityContent: activityContent,
      activityImage: activityImage,
      activityYear: activityYear,
      activityMonth: activityMonth,
      activityDay: activityDay,
      characterIndex: objectActivity[0].characterIndex,
      activityImageName: activityImageName,
    });

    console.log(logger.OK_ACTIVITY_EDIT, "[", logTime, "]");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "게시글 수정 성공",
    });
  } catch (err) {
    console.log(logger.FAIL_ACTIVITY_EDIT, "[", logTime, "]");
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

/**
 *  @route Post activity/delete
 *  @desc delete  activity
 *  @access Public
 */
router.post("/delete", auth, async (req, res) => {
  const time = moment();
  var logTime = time.format("HH:mm:ss");

  const { characterIndex, activityIndex } = req.body;

  try {
    console.log(logger.TRY_ACTIVITY_DELETE, "[", logTime, "]");

    // 수정할 값들을 바탕으로 데이터를 삭제한다.
    const deletedActivity = await Activity.findOneAndDelete({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
      activityIndex: activityIndex,
    });

    // Character 컬렉션에 추가하기 위해 새로 activity를 find 해준다.
    const activityForPush = await Activity.find({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
    });

    const activityForTime = await Activity.find({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
    }).sort({ recentActivityTime: -1 });

    const activityUpdateTime = activityForTime[0]["recentActivityTime"];

    // Character에 수정된 activity 데이터들로 바꿔준다.
    await Character.findOneAndUpdate(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      { activity: activityForPush, recentActivityTime: activityUpdateTime }
    );

    // 캐릭터 인덱스에 해당하는 캐릭터 불러옴 -> array
    const lastActivity = await Character.find(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      { _id: false, activity: true }
    );

    const activityCount = lastActivity[0]["activity"].length;
    console.log(activityCount);
    await Character.findOneAndUpdate(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      {
        activityCount: activityCount,
      }
    );

    if (deletedActivity["activityImageName"] != "") {
      // 삭제한 이미지의 위치를 imageKey에 저장한다
      const imageKey = deletedActivity["activityImageName"];
      // 서버에서 해당 이미지를 삭제한다.
      s3.deleteObject(
        {
          Bucket: "catchmeserver", // 사용자 버켓 이름
          Key: imageKey, // 버켓 내 경로
        },
        (err, data) => {
          if (err) {
            throw err;
          }
        }
      );
    }

    console.log("[삭제된 데이터] \n", deletedActivity);

    // 활동 기록 수를 확인하여 캐릭터 레벨을 돌려준다.
    if (activityCount == 10) {
      await Character.findOneAndUpdate(
        { user_id: req.body.user.id, characterIndex: characterIndex },
        {
          characterLevel: 1,
        }
      );
      console.log(logger.ACTIVITY_LEVEL_DOWN_1, "[", logTime, "]");
      return res.status(222).json({
        status: 222,
        success: true,
        message: "게시물 삭제 성공 && 캐릭터 레벨 다운... 에휴 쯧쯧...",
      });
    } else if (activityCount == 30) {
      await Character.findOneAndUpdate(
        { user_id: req.body.user.id, characterIndex: characterIndex },
        {
          characterLevel: 2,
        }
      );
      console.log(logger.ACTIVITY_LEVEL_DOWN_2, "[", logTime, "]");
      return res.status(222).json({
        status: 222,
        success: true,
        message: "게시물 삭제 성공 && 캐릭터 레벨 다운... 에휴 쯧쯧...",
      });
    }

    console.log(logger.OK_ACTIVITY_DELETE, "[", logTime, "]");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "게시글 삭제 성공",
    });
  } catch (err) {
    console.log(logger.FAIL_ACTIVITY_DELETE, "[", logTime, "]");
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

module.exports = router;
