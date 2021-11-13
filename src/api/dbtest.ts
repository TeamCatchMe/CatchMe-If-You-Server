import auth from "../middleware/auth";
import upload from "../utils/s3";
const mongoose = require("mongoose");
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

import { Router, Request, Response } from "express";
const characterService = require("../services/characterService");
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");

/** hoho
 *====================================================
 *
 *
 *                     activity
 *
 *
 *====================================================
 */

// 여기는 activity 새로 추가하는거 테스트 하는 코드
/**
 *  @route Post activity/newnew
 *  @desc create new activity
 *  @access Public
 */
router.post(
  "/newnew",
  upload.single("activityImage"),
  auth,
  async (req, res) => {
    const time = moment();
    var activityUpdateTime = time.format("YYYYMMDDHHmmss");
    var logTime = time.format("HH:mm:ss");
    var newId = mongoose.Types.ObjectId();

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
      const character = await Character.findOne({
        user_id: req.body.user.id,
        characterIndex: characterIndex,
      });

      const activityCount = character["activityCount"];

      // 만약, Activity가 비어있다면 activityIndex를 1로 설정해줌
      // 그렇지 않은 경우에는 마지막 index+1로 설정한다.
      const lastActivity = await Activity.findOne({
        user_id: req.body.user.id,
        characterIndex: characterIndex,
      }).sort({ activityIndex: -1 });

      if (activityCount == 0) {
        activityIndex = 1;
      } else {
        activityIndex = lastActivity.activityIndex + 1;
      }

      var activityImage = "";
      var activityImageName = "";
      if (req.file) {
        activityImage = req.file.transforms[0]["location"];
        activityImageName = req.file.transforms[0]["key"];
      }

      const activityAdded = new Activity({
        _id: newId,
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

      // 해당 캐릭터의 activity 개수
      const countAfterUpdate = activityCount + 1;

      // 새로 생성한 activity의 id 값을 character에 추가하고, activity의 개수를 업데이트 해준다.
      await Character.findOneAndUpdate(
        { user_id: req.body.user.id, characterIndex: characterIndex },
        {
          recentActivityTime: activityUpdateTime,
          activityCount: countAfterUpdate,
          $push: { activityId: newId },
        },
        { useFindAndModify: false, new: true, upsert: true }
      );

      // 새로 추가된 activity를 출력해본다!
      console.log("[추가된 데이터] \n", activityAdded);

      await activityAdded.save();

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
        message: "게시글 생성 통신 성공",
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
  }
);

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

    // 캐릭터 인덱스에 해당하는 액티비티 불러옴
    const objectActivity = await Activity.findOne({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
      activityIndex: activityIndex,
    });

    // 이미지를 새로 업로드하지 않는 경우에는 기존 이미지 값을 가져온다.
    var activityImage = objectActivity["activityImage"];
    var activityImageName = objectActivity["activityImageName"];

    if (req.file) {
      // 새로 이미지를 업데이트 하는경우, 기존 이미지의 이름을 찾아 imageKey에 저장한다
      const imageKey = objectActivity["activityImageName"];

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

      // 새로 저장된 이미지의 정보를 가져온다
      activityImage = req.file.transforms[0]["location"];
      activityImageName = req.file.transforms[0]["key"];
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

    console.log("[수정된 데이터] \n", {
      user_id: req.body.user.id,
      activityIndex: objectActivity.activityIndex,
      activityContent: activityContent,
      activityImage: activityImage,
      activityYear: activityYear,
      activityMonth: activityMonth,
      activityDay: activityDay,
      characterIndex: objectActivity.characterIndex,
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
  var activityUpdateTime = "0";
  const { characterIndex, activityIndex } = req.body;

  try {
    console.log(logger.TRY_ACTIVITY_DELETE, "[", logTime, "]");

    // 수정할 값들을 바탕으로 데이터를 삭제한다.
    const deletedActivity = await Activity.findOneAndDelete({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
      activityIndex: activityIndex,
    });

    console.log(deletedActivity);

    // Character 컬렉션에 추가하기 위해 새로 activity를 find 해준다.
    var character = await Character.findOne({
      user_id: req.body.user.id,
      characterIndex: characterIndex,
    });

    let activityCount = character.activityCount;
    let edittedActivityCount;

    // 캐릭터의 activityCount와 activityUpdateTime을 업데이트 해주기위한 작업
    if (activityCount == 1) {
      /*  
      activity가 하나일 경우에는, 
      activityCount를 0으로
      activityUpdateTime을 캐릭터 생성 시간으로 수정한다.
      */
      const forEdit = await Character.findOne({
        user_id: req.body.user.id,
        characterIndex: characterIndex,
      });

      activityUpdateTime = forEdit["characterBirth"];
      edittedActivityCount = 0;
    } else {
      /*  
      activity가 두 개 이상일 경우에는, 
      activityCount를 하나 뺀 수으로
      activityUpdateTime을 삭제하고 남은 액티비티의 가장 최근 시간으로 수정한다.
      */
      const activityForTime = await Activity.find({
        user_id: req.body.user.id,
        characterIndex: characterIndex,
      }).sort({ recentActivityTime: -1 });

      console.log("activityForTime : ", activityForTime);
      console.log(
        "activityForTime[0]['recentActivityTime'] : ",
        activityForTime[0]["recentActivityTime"]
      );
      activityUpdateTime = activityForTime[0]["recentActivityTime"];
      edittedActivityCount = activityCount - 1;
    }

    // 앞서 정한 정보들을 바탕으로 Character에 삭제된 activity 데이터를 빼주고,
    // 마지막 활동 시간과 activityCount를 바꿔준다.
    await Character.findOneAndUpdate(
      { user_id: req.body.user.id, characterIndex: characterIndex },
      {
        recentActivityTime: activityUpdateTime,
        activityCount: edittedActivityCount,
        $pull: { activityId: deletedActivity._id },
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
    if (edittedActivityCount == 10) {
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
    } else if (edittedActivityCount == 30) {
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

/**
 *====================================================
 *
 *
 *                     character
 *
 *
 *====================================================
 */

/**
 *  @route GET character/:characterIndex
 *  @desc Get character information and all activities
 *  @access Public
 */

router.get(
  "/character/:characterIndex",
  auth,
  async (req: Request, res: Response) => {
    var allActivitiesCount = 0;
    const characterIndex = req.params.characterIndex;
    const user_id = req.body.user.id;

    try {
      const time = moment();
      var logTime = time.format("HH:mm:ss");
      console.log(logger.TRY_CHARACTER, "[", logTime, "]");

      // 캐릭터의 정보를 가져옵니다.
      const character = await Character.findOne({
        user_id,
        characterIndex: Number(characterIndex),
      })
        .populate("activityId", { _id: 0, user_id: 0 })
        .select({ _id: 0, user_nickname: 0 });

      var characterActivitiesCount = character["activityCount"];
      var catchRate = 0;

      if (!character) {
        console.log(
          logger.FAIL_CHARACTER,
          "[ 캐릭터 데이터 없음 ]",
          "[",
          logTime,
          "]"
        );
        res.status(sc.EMPTY).send({
          message: rm.NOT_FOUND_CHARACTER,
          data: null,
        });
      }

      if (character["activityCount"] == 0) {
        console.log(
          logger.OK_CHARACTER,
          "[ 당월 게시글 데이터 없음 ]",
          "[",
          logTime,
          "]"
        );
        return res.status(sc.OK_NOT_FOUND_ACTIVITY).json({
          message: rm.OK_BUT_NO_ACTIVITY,
          character,
          characterActivitiesCount,
          catchRate,
        });
      }

      // catchRate 계산!
      // 전체 캐릭터가 쓴 게시글의 총 개수를 구합니다.
      const allCharacter = await Character.find({
        user_id,
      }).sort({ activityYear: -1, activityMonth: -1 });

      for (var i = 0; i < allCharacter.length; i++) {
        allActivitiesCount += allCharacter[i]["activityCount"];
      }

      // 캐치지수를 계산합니다.
      catchRate = Math.floor(
        (characterActivitiesCount / allActivitiesCount) * 100
      );

      console.log(
        character,
        "\ncharacterActivitiesCount : ",
        characterActivitiesCount,
        "allActivitiesCount : ",
        allActivitiesCount,
        "catchRate : ",
        catchRate
      );

      console.log(
        logger.OK_CHARACTER,
        "<",
        character["characterName"],
        ">",
        "[",
        logTime,
        "]"
      );
      return res.status(sc.OK).json({
        message: rm.CHARACTER_OK,
        character: character,
        characterActivitiesCount,
        catchRate,
      });
    } catch (error) {
      console.log(logger.FAIL_CHARACTER, "[", logTime, "]");
      res.status(sc.SERVER_ERROR).send({
        message: rm.SERVER_ERROR,
      });
    }
  }
);

module.exports = router;
