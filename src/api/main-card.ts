import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth"
import CharacterTest from "../models/CharacterTest";
const getDateString = require("../modules/getDate");

const router = Router();

/**
 *  @route GET maincard/
 *  @desc Get all characters (최근 활동순)
 *  @access Public
 */
router.get("/", auth ,async (req: Request, res: Response) => {
  try {

    const characters = await CharacterTest
      .find({ user_id : req.body.user_id }) // 컬렉션의 user_id 속성은 나중에 캐릭터 생성 시 넘겨주는 유저 정보로 수정
      .sort({"activityDate" : -1})
      .limit(10);

    if (!characters) {
      return res.status(400).json(null);
    }

    res.json({
      "status" : 200,
      "success" : true,
      "message" : "최근활동순 캐릭터 목록 가져오기 성공",
      "data": {
        "characters" : characters
      }
    })
    
    console.log("캐릭터 목록 불러오기 성공");

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
        "status" : 500,
        "success" : false,
        "message" : "서버 내부 오류"
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

    const characters = await CharacterTest
      .find({ user_id : req.body.user_id }) // 컬렉션의 user_id 속성은 나중에 캐릭터 생성 시 넘겨주는 유저 정보로 수정
      .sort({"activityDate" : -1})
      .limit(10);

    if (!characters) {
      return res.status(400).json(null);
    }

    res.json({
      "status" : 200,
      "success" : true,
      "message" : "최다활동순 캐릭터 목록 가져오기 성공",
      "data": {
        "characters" : characters
      }
    })
    
    console.log("캐릭터 목록 불러오기 성공");

  } catch (error) {
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

 router.get("/recent", auth ,async (req: Request, res: Response) => {
  try {

    const characters = await CharacterTest
      .find({ user_id : req.body.user_id }) // 컬렉션의 user_id 속성은 나중에 캐릭터 생성 시 넘겨주는 유저 정보로 수정
      .sort({"activityDate" : -1})
      .limit(10);

    if (!characters) {
      return res.status(400).json(null);
    }

    res.json({
      "status" : 200,
      "success" : true,
      "message" : "최근생성순 캐릭터 목록 가져오기 성공",
      "data": {
        "characters" : characters
      }
    })
    
    console.log("캐릭터 목록 불러오기 성공");

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
        "status" : 500,
        "success" : false,
        "message" : "서버 내부 오류"
    });
  }
});

/**
 *  @route Post main-card/create
 *  @desc Create new character
 *  @access Public
 */

 router.post(
  "/create",
  [
    check("characterName", "characterName is required").exists(),
    check("characterPrivacy", "characterPrivacy is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { characterName, characterIndex, characterImageIndex, characterPrivacy } = req.body;
    const characterBirth = getDateString.nowDate;

    try {
      const newCharacter = new CharacterTest({
        user_id : req.body.user_id,
        characterName : characterName,
        characterIndex : characterIndex,
        characterImageIndex : characterImageIndex,
        characterPrivacy : characterPrivacy,
        characterLevel : 1,
        characterBirth : characterBirth
      });

      await newCharacter.save();

      return res.status(200).json({
        status: 200,
        success: true,
        message: "캐릭터 생성 성공",
        data : {
          "createdCharacter" : newCharacter
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: 500,
        success: false,
        message: "서버 내부 오류",
      });
    }
  }
);

console.log("[GET] maincard API 불러오기 성공");

module.exports = router;