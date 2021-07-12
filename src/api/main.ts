import express from "express";
import auth from "../middleware/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { check, validationResult } from "express-validator";

const router = express.Router();

import UserData from "../models/Userdata";
import Character from "../models/Character";
import Activity from "../models/Activity";

/*
 *  @route GET /main
 *  @desc Test Route
 *  @access Public
 */
router.get("/", auth, async function (req, res) {
  try {
    const maindata = await Character.find(
      {
        user_id: req.body.user.id,
      },
      { _id: false, user_id: false }
    )
      .sort({ ResentActivityTime: -1 })
      .limit(5);

    const dataForCount = await Character.find(
      {
        user_id: req.body.user.id,
      },
      { activity: true, _id: false }
    );

    const resultData = await Character.find(
      {
        user_id: req.body.user.id,
      },
      {
        _id: false,
        user_id: false,
        activity: false,
        characterBirth: false,
        ResentActivityTime: false,
        characterPrivacy: false,
      }
    )
      .sort({ ResentActivityTime: -1 })
      .limit(5);

    // 다섯개 캐릭터의 게시글 개수를 구합니다.
    const activityCount = new Array();
    for (var i = 0; i < maindata.length; i++) {
      activityCount.push(maindata[i]["activity"].length);
    }

    // 전체 캐릭터가 쓴 게시글의 총 개수를 구합니다.
    var allActivityCount = 0;
    for (var i = 0; i < dataForCount.length; i++) {
      allActivityCount += dataForCount[i]["activity"].length;
    }

    // 사용자에게 전달한 간단 리포트의 총 게시물수, 전체중 퍼센트 값을 추가합니다.
    for (var i = 0; i < resultData.length; i++) {
      resultData[i]["activityCount"] = activityCount[i];
      resultData[i]["countPercentage"] = Math.floor(
        (activityCount[i] / allActivityCount) * 100
      );
    }

    console.log("메인 캐릭터 조회 성공 ");
    return res.json({
      status: 200,
      success: true,
      message: "메인 캐릭터 조회 성공",
      data: resultData,
    });
  } catch (err) {
    console.log("메인 캐릭터 조회 실패 (500)");
    console.error(err.message);
    return res.status(500).send("Server Err");
  }
});

module.exports = router;
