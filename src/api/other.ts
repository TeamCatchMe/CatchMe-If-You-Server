import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import Activity from "../models/Activity";
import Character from "../models/Character";
import Userdata from "../models/Userdata";
const logger = require("../modules/logger");
const moment = require("moment");
const router = Router();

/**
 *  @route GET other/
 *  @desc Get all characters 
 *  @access Public
 */
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_OTHER, "[", logTime, "]")
    const userdata = await Userdata.find({ user_id : req.body.user.id })

    const characters = await Character
    .find({ characterPrivacy : false })
    .sort({ recentActivityTime : -1 })
    .select({  _id: 0, activity : 0 })
    .limit(30);

    if (!characters) {
      console.log(logger.FAIL_OTHER_DETAIL, "[캐릭터 데이터 없음]", "[", logTime, "]")
      return res.status(400).json({
        status: 400,
        success: false,
        message: "캐릭터가 존재 하지 않습니다.",
        data: null,
      });
    }

    console.log(logger.OK_OTHER, "[", logTime, "]")
    return res.status(200).json({
      status: 200,
      success: true,
      message: "구경하기 데이터 가져오기 성공",
      data: characters,
    });

  } catch (error) {
    console.error(error.message);
    console.log(logger.FAIL_OTHER, "[", logTime, "]")
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

/**
 *  @route GET other/detail
 *  @desc Get character info for other 
 *  @access Public
 */
 router.get("/detail/:user_id/:characterIndex", auth, async (req: Request, res: Response) => {
  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_OTHER_DETAIL, "[", logTime, "]")

    const { user_id, characterIndex} = req.params;

    const character = await Character
    .findOne({ user_id : user_id, characterIndex : Number(characterIndex)})
    .select({  _id: 0 })

    var characterActivitiesCount = character["activityCount"];
    var catchRate = 0;
    var allActivitiesCount = 0;

    if (!character) {
      console.log(logger.FAIL_OTHER_DETAIL, "[캐릭터 데이터 없음]", "[", logTime, "]")
      return res.status(400).json({
        status: 400,
        success: false,
        message: "캐릭터 데이터가 존재 하지 않습니다.",
        data: null,
      });
    }

    if (character["activityCount"] == 0) {
      console.log(logger.OK_OTHER_DETAIL, "[당월 게시글 데이터 없음]", "[", logTime, "]")

      return res.status(200).json({
        status: 200,
        success: true,
        message: "통신성공, 당월 게시글이 존재하지 않습니다.",
        data: {
          character,
          characterActivitiesCount,
          catchRate
        }
      });
    }

    const allActivities = await Character
    .find({ user_id : req.body.user.id })
    .sort({ activityYear : -1, activityMonth : -1 });
    
    // 전체 캐릭터가 쓴 게시글의 총 개수를 구합니다.
    for (var i = 0; i < allActivities.length; i++) {
      allActivitiesCount += allActivities[i]["activityCount"];
    }

    catchRate = Math.floor(characterActivitiesCount / allActivitiesCount * 100);
    
    console.log(logger.OK_OTHER_DETAIL, "<", character['characterName'], ">", "[", logTime, "]")
    return res.status(200).json({
      status: 200,
      success: true,
      message: "구경하기 캐릭터 상세정보 가져오기 성공",
      data: {
        character,
        characterActivitiesCount,
        catchRate
      }
    });

  } catch (error) {
    console.error(error.message);
    console.log(logger.FAIL_OTHER_DETAIL, "[", logTime, "]")
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

module.exports = router;