import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";
import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import Character from "../models/Character";
import Userdata from "../models/Userdata";
const router = Router();
const logger = require("../modules/logger");
const moment = require("moment");

const characterService = require("../services/characterService");
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");

/**
 *  @route GET character/:characterIndex
 *  @desc Get character information and all activities
 *  @access Public
 */

router.get("/:characterIndex", auth, async (req: Request, res: Response) => {
  var allActivitiesCount = 0;
  const characterIndex = req.params.characterIndex;
  const user_id = req.body.user.id;

  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_CHARACTER, "[", logTime, "]");

    // req.body 의 characterIndex를 가지는 캐릭터의 데이터를 가져옵니다. (객체)
    const character = await characterService.getCharacter(
      user_id,
      characterIndex
    );

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

    // 전체 캐릭터의 전체 게시글을 가져옵니다.
    const allActivities = await characterService.getAllActivities(
      user_id,
      characterIndex
    );
    console.log("여기 나오냐?", allActivities);

    // 전체 캐릭터가 쓴 게시글의 총 개수를 구합니다.
    for (var i = 0; i < allActivities.length; i++) {
      allActivitiesCount += allActivities[i]["activityCount"];
    }

    catchRate = Math.floor(
      (characterActivitiesCount / allActivitiesCount) * 100
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
      character,
      characterActivitiesCount,
      catchRate,
    });
  } catch (error) {
    console.log(logger.FAIL_CHARACTER, "[", logTime, "]");
    res.status(sc.SERVER_ERROR).send({
      message: rm.SERVER_ERROR,
    });
  }
});

/**
 *  @route Post character/
 *  @desc Create new character
 *  @access Public
 */

router.post("/", auth, async (req, res) => {
  const user_id = req.body.user.id;
  const { characterName, characterImageIndex, characterPrivacy } = req.body;

  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_MAINCARD_CREATE, "[", logTime, "]");

    const lastCharacter = await characterService.getLastCharacter(user_id);
    const user_nickname = await Userdata.findOne({ _id: user_id });

    if (!lastCharacter) {
      var characterIndex = 1;
    } else {
      characterIndex = lastCharacter[0]["characterIndex"] + 1;
    }
    var characterBirth = time.format("YYYYMMDDHHmmss");

    const newCharacter = await characterService.createCharacter(
      user_id,
      user_nickname,
      characterName,
      characterIndex,
      characterImageIndex,
      characterPrivacy,
      characterBirth
    );

    console.log(logger.OK_MAINCARD_CREATE, "[", logTime, "]");
    return res.status(sc.CREATED).send({ message: rm.CHARACTER_CREATE_OK });
  } catch (err) {
    res.status(sc.SERVER_ERROR).send({ message: rm.SERVER_ERROR });
  }
});

/**
 *  @route Post character/edit
 *  @desc edit character info
 *  @access Public
 */
router.post("/edit", auth, async (req, res) => {
  const user_id = req.body.user.id;
  const { characterIndex, characterName, characterPrivacy } = req.body;
  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_CHARACTER_EDIT, "[", logTime, "]");

    const isCharacterExist = await characterService.isCharacterExist(
      user_id,
      characterIndex
    );

    await characterService.editCharacter(
      user_id,
      characterIndex,
      characterName,
      characterPrivacy
    );

    console.log(logger.OK_CHARACTER_EDIT, "[", logTime, "]");
    return res.status(sc.OK).send({ message: rm.CHARACTER_EDIT_OK });
  } catch (err) {
    console.log(logger.FAIL_CHARACTER_EDIT, "[", logTime, "]");
    res.status(sc.SERVER_ERROR).send({ message: rm.SERVER_ERROR });
  }
});

console.log("character API 불러오기 성공");
module.exports = router;
