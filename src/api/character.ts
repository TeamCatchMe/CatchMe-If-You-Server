import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import Character from "../models/Character";
const router = Router();
const logger = require("../modules/logger");
const moment = require("moment");

/**
 *  @route GET character/
 *  @desc Get character information and all activities
 *  @access Public
 */

router.get("/:characterIndex", auth ,async (req: Request, res: Response) => {
  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_CHARACTER, "[", logTime, "]")
    
    var allActivitiesCount = 0;
    const characterIndex = req.params.characterIndex;

    // req.body 의 characterIndex를 가지는 캐릭터의 데이터를 가져옵니다. (객체)
    const character = await Character
    .findOne({ user_id : req.body.user.id, characterIndex : Number(characterIndex)})
    .select({ _id : 0, user_nickname : 0 });

    var characterActivitiesCount = character["activityCount"];
    var catchRate = 0;

    if ( !character ) {
      console.log(logger.FAIL_CHARACTER, "[ 캐릭터 데이터 없음 ]", "[", logTime, "]")
      res.status(400).json({
        status: 400,
        success: false,
        message: "캐릭터 데이터가 존재 하지 않는다. 미안.",
        data : null
      });
    }

    if ( character["activityCount"] == 0 ) {
      console.log(logger.OK_CHARACTER, "[ 당월 게시글 데이터 없음 ]", "[", logTime, "]")
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

    // 전체 캐릭터의 전체 게시글을 가져옵니다.
    const allActivities = await Character
    .find({ user_id : req.body.user.id })
    .sort({ activityYear : -1, activityMonth : -1 });
     
    // 전체 캐릭터가 쓴 게시글의 총 개수를 구합니다.
    for (var i = 0; i < allActivities.length; i++) {
      allActivitiesCount += allActivities[i]["activityCount"];
    }

    catchRate = Math.floor(characterActivitiesCount / allActivitiesCount * 100);

    console.log(logger.OK_CHARACTER, "<", character['characterName'], ">", "[", logTime, "]")
    return res.status(200).json({
      status: 200,
      success: true,
      message: "캐릭터 상세정보 불러오기 성공",
      data: {
        character,
        characterActivitiesCount,
        catchRate
      },
    });
  } catch (error) {
    console.log(logger.FAIL_CHARACTER, "[", logTime, "]")
    console.error(error.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

/**
 *  @route Post character/edit
 *  @desc edit character info
 *  @access Public
 */
 router.post("/edit", auth, async (req, res) => {
  const time = moment();
  var logTime = time.format("HH:mm:ss");
  console.log(logger.TRY_CHARACTER_EDIT, "[", logTime, "]")
  
  const { characterIndex, characterName, characterPrivacy } = req.body;

  const checkIndex = await Character
  .find({user_id : req.body.user.id, characterIndex : characterIndex }).countDocuments();

  if ( checkIndex == 0 ) {
    console.log(logger.FAIL_CHARACTER_EDIT, "[ 존재하지 않는 캐릭터 인덱스 입력 ]","[", logTime, "]")
    return res.status(400).json({
      status: 400,
      success: false,
      message: "실패 - 존재하지 않는 캐릭터 인덱스 입력",
    });
  }

  try {
    // 수정할 값들을 바탕으로 데이터를 수정해준다.
    await Character.findOneAndUpdate(
      {
        user_id: req.body.user.id,
        characterIndex: characterIndex,
      },
      {
        characterName: characterName,
        characterPrivacy : characterPrivacy,
      }
    );

    console.log("[수정된 데이터] \n", {
      characterName: characterName,
      characterPrivacy : characterPrivacy,
    });

    console.log(logger.OK_CHARACTER_EDIT, "[", logTime, "]")
    return res.status(200).json({
      status: 200,
      success: true,
      message: "캐릭터 수정 성공",
    });
  } catch (err) {
    console.log(logger.FAIL_CHARACTER_EDIT, "[", logTime, "]")
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

console.log("character API 불러오기 성공");
module.exports = router;