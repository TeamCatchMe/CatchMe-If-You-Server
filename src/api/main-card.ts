import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import Character from "../models/Character";

const moment = require("moment");
const router = Router();

/**
 *  @route GET maincard/
 *  @desc Get all characters (최근 활동순)
 *  @access Public
 */
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const characters = await Character.find({ user_id: req.body.user.id })
      .sort({ recentActivityTime : -1 })
      .select({ user_id: 0, _id: 0, activity : 0 });

    if (!characters) {
      console.log("캐릭터 데이터 없음");
      return res.status(400).json({
        status: 400,
        success: false,
        message: "캐릭터가 존재 하지 않습니다.",
        data: null,
      });
    }

    console.log("최근활동순 캐릭터 목록 가져오기 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "최근활동순 캐릭터 목록 가져오기 성공",
      data: characters,
    });

  } catch (error) {
    console.error(error.message);
    console.log("최근활동순 캐릭터 목록 가져오기 실패");
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

/**
 *  @route GET maincard/most
 *  @desc Get all characters (최다 활동순)
 *  @access Public
 */

router.get("/most", auth ,async (req: Request, res: Response) => {
  try {

    const characters = await Character
    .find({ user_id : req.body.user.id })
    .sort({activityCount : -1})
    .select({ user_id: 0, _id: 0, activity : 0 });;

    if (characters.length == 0) {
      console.log("캐릭터 데이터 없음");
      return res.status(400).json({
        "status" : 400,
        "success" : false,
        "message" : "캐릭터가 존재 하지 않습니다.",
        "data" : null
      });
    }

    console.log("최다활동순 캐릭터 목록 불러오기 성공");
    return res.status(200).json({
      "status" : 200,
      "success" : true,
      "message" : "최다활동순 캐릭터 목록 가져오기 성공",
      "data" : characters
    })

  } catch (error) {
    console.log("최다활동순 캐릭터 목록 불러오기 실패");
    console.error(error.message);
    res.status(500).json({
        "status" : 500,
        "success" : false,
        "message" : "서버 내부 오류"
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
  try {
    const characters = await Character
    .find({ user_id: req.body.user.id })
    .sort({ "characterBirth": -1 })
    .select({ user_id: 0, _id: 0, activity : 0 });

    if (!characters) {
      console.log("캐릭터 데이터 없음");
      return res.status(400).json({
        status: 400,
        success: false,
        message: "캐릭터가 존재 하지 않습니다.",
        data: null,
      });
    }

    console.log("최근생성순 캐릭터 목록 불러오기 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "최근생성순 캐릭터 목록 가져오기 성공",
      data: characters,
    });

  } catch (error) {
    console.log("최근생성순 캐릭터 목록 불러오기 실패");
    console.error(error.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

/**
 *  @route Post maincard/create
 *  @desc Create new character
 *  @access Public
 */

router.post("/create", auth, async (req, res) => {
  const time = moment();
  
  const lastCharacter = await Character.find({ user_id: req.body.user.id })
    .sort({ _id: -1 })
    .select({ user_id: 0, _id: 0 });
  
  if ( lastCharacter.length == 0 ) {
    var characterIndex = 1
  } else {
    characterIndex = lastCharacter[0]["characterIndex"] + 1;
  }

  var characterBirth = time.format("YYYYMMDDHHmmss");
  const { characterName, characterImageIndex, characterPrivacy } = req.body;

  try {
    const newCharacter = new Character({
      user_id: req.body.user.id,
      characterName: characterName,
      characterIndex: characterIndex,
      characterImageIndex: characterImageIndex,
      characterPrivacy: characterPrivacy,
      characterLevel: 1,
      characterBirth: characterBirth,
      resentActivityTime: characterBirth,
      activityCount : 0
    });

    await newCharacter.save();

    console.log("캐릭터 생성 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "캐릭터 생성 성공",
    });
  } catch (err) {
    console.log("캐릭터 생성 실패");
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

console.log("maincard API 불러오기 성공");

module.exports = router;
