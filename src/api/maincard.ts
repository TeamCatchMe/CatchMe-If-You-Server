import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import Character from "../models/Character";
import Userdata from "../models/Userdata";
const logger = require("../modules/logger");
const moment = require("moment");
const router = Router();
const maincardService = require("../services/maincardService");
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");

/**
 *  @route GET maincard/
 *  @desc Get all characters (최근 활동순)
 *  @access Public
 */
router.get("/", auth, async (req: Request, res: Response) => {
  const user_id = req.body.user.id;

  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_MAINCARD, "[", logTime, "]");

    const characters = await maincardService.getCharacters(user_id);

    if (!characters) {
      console.log(
        logger.FAIL_MAINCARD,
        "[캐릭터 데이터 없음]",
        "[",
        logTime,
        "]"
      );
      return res.status(sc.EMPTY).send({
        message: rm.NOT_FOUND_CHARACTER,
        data: null,
      });
    }

    console.log(logger.OK_MAINCARD, "[", logTime, "]");
    return res.status(sc.OK).json({
      message: rm.MAIN_CARD_OK,
      data: characters,
    });
  } catch (error) {
    console.log(logger.FAIL_MAINCARD, "[", logTime, "]");
    res.status(sc.SERVER_ERROR).send({
      message: rm.SERVER_ERROR,
    });
  }
});

/**
 *  @route GET maincard/most
 *  @desc Get all characters (최다 활동순)
 *  @access Public
 */

router.get("/most", auth, async (req: Request, res: Response) => {
  const user_id = req.body.user.id;

  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_MAINCARD_MOST, "[", logTime, "]");

    const characters = await maincardService.getCharactersMost(user_id);

    if (!characters) {
      console.log(
        logger.FAIL_MAINCARD,
        "[캐릭터 데이터 없음]",
        "[",
        logTime,
        "]"
      );
      return res.status(sc.EMPTY).send({
        message: rm.NOT_FOUND_CHARACTER,
        data: null,
      });
    }

    console.log(logger.OK_MAINCARD, "[", logTime, "]");
    return res.status(sc.OK).json({
      message: rm.MAIN_CARD_MOST_OK,
      data: characters,
    });
  } catch (error) {
    console.log(logger.FAIL_MAINCARD, "[", logTime, "]");
    res.status(sc.SERVER_ERROR).send({
      message: rm.SERVER_ERROR,
    });
  }
});

/**
 *  @route GET maincard/recent
 *  @desc Get all characters (최근 캐릭터 생성순)
 *  @access Public
 */

// characterBirth(yyyymmdd)로 sorting
router.get("/recent", auth, async (req: Request, res: Response) => {
  const user_id = req.body.user.id;

  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_MAINCARD_RECENT, "[", logTime, "]");

    const characters = await maincardService.getCharactersRecent(user_id);

    if (!characters) {
      console.log(
        logger.FAIL_MAINCARD,
        "[캐릭터 데이터 없음]",
        "[",
        logTime,
        "]"
      );
      return res.status(sc.EMPTY).send({
        message: rm.NOT_FOUND_CHARACTER,
        data: null,
      });
    }

    console.log(logger.OK_MAINCARD_RECENT, "[", logTime, "]");
    return res.status(sc.OK).json({
      message: rm.MAIN_CARD_CREATED_OK,
      data: characters,
    });
  } catch (error) {
    console.log(logger.FAIL_MAINCARD_RECENT, "[", logTime, "]");
    res.status(sc.SERVER_ERROR).send({
      message: rm.SERVER_ERROR,
    });
  }
});

console.log("maincard API 불러오기 성공");
module.exports = router;
