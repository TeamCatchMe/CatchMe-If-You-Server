import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth"
const getDateString = require("../modules/getDate");

import Character from "../models/Character";
import Userdata from "../models/Userdata";

const router = Router();

/**
 *  @route GET maincard/
 *  @desc Get all characters (최근 활동순)
 *  @access Public
 */
router.get("/", auth ,async (req: Request, res: Response) => {
  try {
    const user = await Userdata.findById(req.body.user.id).select("-password");
    const characters = await Character
      .find({ user_id : user.id })
      .sort({"activityDate" : -1});

    if (!characters) {
      return res.status(400).json({
        "status" : 400,
        "success" : false,
        "message" : "캐릭터가 존재 하지 않습니다.",
        "data" : null
      });
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

// 작업중) 게시글 작성시 index 추가하는 기능 완성되면 sorting 가능
// router.get("/most", auth ,async (req: Request, res: Response) => {
//   try {
//     const user = await Userdata.findById(req.body.user.id).select("-password");

//     const characters = await Character
//       .find({ user_id : user.id })
//       .sort({"activity.activityIndex" : -1});

//     if (!characters) {
//       return res.status(400).json({
//         "status" : 400,
//         "success" : false,
//         "message" : "캐릭터가 존재 하지 않습니다.",
//         "data" : null
//       });
//     }

//     res.json({
//       "status" : 200,
//       "success" : true,
//       "message" : "최다활동순 캐릭터 목록 가져오기 성공",
//       "data": {
//         "characters" : characters
//       }
//     })
    
//     console.log("캐릭터 목록 불러오기 성공");

//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({
//         "status" : 500,
//         "success" : false,
//         "message" : "서버 내부 오류"
//     });
//   }
// });

/**
 *  @route GET maincard/recent
 *  @desc Get all characters (최근 캐릭터 생성순)
 *  @access Public
 */

// characterBirth(yyyymmdd)로 sorting
router.get("/recent", auth ,async (req: Request, res: Response) => {
  try {
    const user = await Userdata.findById(req.body.user.id).select("-password");
    const characters = await Character
      .find({ user_id : user.id })
      .sort({"character.characterBirth" : -1});

    if (!characters) {
      return res.status(400).json({
        "status" : 400,
        "success" : false,
        "message" : "캐릭터가 존재 하지 않습니다.",
        "data" : null
      });
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
  auth,
  [
    check("characterName", "characterName is required").exists(),
    check("characterPrivacy", "characterPrivacy is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await Userdata.findById(req.body.user.id).select("-password");

    const characterCount = await Character.find({user_id : user.id}).countDocuments();
    const characterBirth = getDateString.nowDateFull;

    const { 
      characterName,
      characterImageIndex,
      characterPrivacy
    } = req.body;

    try {
      const newCharacter = new Character({
        user_id : user.id,
        character : [
          {
            characterName : characterName,
            characterIndex : characterCount,
            characterImageIndex : characterImageIndex,
            characterPrivacy : characterPrivacy,
            characterLevel : 1,
            characterBirth : characterBirth
          }
        ]
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

console.log("maincard API 불러오기 성공");

module.exports = router;