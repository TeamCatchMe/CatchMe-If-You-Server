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
      if (activityCount == 0) {
        activityIndex = 1;
      } else {
        activityIndex = activityCount + 1;
      }

      var activityImage = "";
      var activityImageName = "";
      if (req.file) {
        activityImage = req.file.location;
        activityImageName = req.file.key;
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

      const countAfterUpdate = activityCount + 1;

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
