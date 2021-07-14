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
    console.log("[/activity/new] activity 활동 기록 등록 시도 ");

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
      // 그렇지 않으면 lastActivity에 담겨있는 것들중에서 제일 마지막 것의 인덱스를 lastIndex에 담아줌
      const lastIndex = activityCount - 1;
      activityIndex =
        lastActivity[0]["activity"][lastIndex]["activityIndex"] + 1;
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
      recentActivityTime: activityUpdateTime,
      characterIndex: characterIndex,
      activityImageName: activityImageName,
    });

    const countAfterUpdate = activityCount + 1;
    await Character.findOneAndUpdate(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      {
        ResentActivityTime: activityUpdateTime,
        activityCount: countAfterUpdate,
      }
    );

    console.log("[추가된 데이터] \n", activityAdded);

    await activityAdded.save();

    const edittedActivity = await Activity.find({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
    });

    await Character.findOneAndUpdate(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      { activity: edittedActivity }
    );

    // 활동 기록 수를 확인하여 캐릭터 레벨업
    if (countAfterUpdate == 11) {
      await Character.findOneAndUpdate(
        { characterIndex: characterIndex },
        {
          characterLevel: 2,
        }
      );
      console.log("[/activity/new] 활동 기록 등록 성공 및 2레벨 도달 ");
      return res.status(222).json({
        status: 222,
        success: true,
        message:
          "게시물 등록 성공 && 캐릭터 레벨 업!!! 끼얏호오오~~ 레벨업이다!!",
      });
    } else if (countAfterUpdate == 31) {
      await Character.findOneAndUpdate(
        { characterIndex: characterIndex },
        {
          characterLevel: 3,
        }
      );
      console.log("[/activity/new] 활동 기록 등록 성공 및 3레벨 도달 ");
      return res.status(222).json({
        status: 222,
        success: true,
        message:
          "게시물 등록 성공 && 캐릭터 레벨 업!!! 끼얏호오오~~ 레벨업이다!!",
      });
    }

    console.log("[/activity/new] 활동 기록 등록 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "게시글 생성 성공",
    });
  } catch (err) {
    console.log("[/activity/new] 활동 기록 등록 실패 - 서버 내부 오류 ");
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
    console.log("[/activity/edit] 활동 기록 수정 시도");

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

    // 수정할 값들을 바탕으로 데이터를 수정해준다.
    await Activity.findOneAndUpdate(
      {
        user_id: req.body.user.id,
        characterIndex: characterIndex,
        activityIndex: activityIndex,
      },
      {
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

    console.log("[/activity/edit] 활동 기록 수정 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "게시글 수정 성공",
    });
  } catch (err) {
    console.log("[/activity/edit] 활동 기록 수정 실패 - 서버 내부 오류 (500)");
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
  const { characterIndex, activityIndex } = req.body;

  try {
    console.log("[/activity/delete] 활동 기록 삭제 시도");

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
      { characterIndex: characterIndex },
      { activity: activityForPush, recentActivityTime: activityUpdateTime }
    );

    // 캐릭터 인덱스에 해당하는 캐릭터 불러옴 -> array
    const lastActivity = await Character.find(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      { _id: false, activity: true }
    );

    const activityCount = lastActivity[0]["activity"].length;
    await Character.findOneAndUpdate(
      { characterIndex: characterIndex },
      {
        activityCount: activityCount,
      }
    );

    console.log("[삭제된 데이터] \n", deletedActivity);

    // 활동 기록 수를 확인하여 캐릭터 레벨을 돌려준다.
    if (activityCount == 10) {
      await Character.findOneAndUpdate(
        { characterIndex: characterIndex },
        {
          characterLevel: 1,
        }
      );
      console.log("[/activity/delete] 활동 기록 삭제 성공 및 레벨 1 강등");
      return res.status(222).json({
        status: 222,
        success: true,
        message: "게시물 삭제 성공 && 캐릭터 레벨 다운... 에휴 쯧쯧...",
      });
    } else if (activityCount == 30) {
      await Character.findOneAndUpdate(
        { characterIndex: characterIndex },
        {
          characterLevel: 2,
        }
      );
      console.log("[/activity/delete] 활동 기록 삭제 성공 및 레벨 2 강등");
      return res.status(222).json({
        status: 222,
        success: true,
        message: "게시물 삭제 성공 && 캐릭터 레벨 다운... 에휴 쯧쯧...",
      });
    }

    console.log("[/activity/delete] 활동 기록 삭제 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "게시글 삭제 성공",
    });
  } catch (err) {
    console.log("[/activity/delete] 활동 기록 삭제 실패 - 서버 내부 오류");
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

module.exports = router;
