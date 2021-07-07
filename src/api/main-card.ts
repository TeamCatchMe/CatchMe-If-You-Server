import { Router, Request, Response } from "express";

import CharactersTest from "../models/CharacterTest";

const router = Router();

/**
 *  @route GET maincard/
 *  @desc Get all characters (최근활동순)
 *  @access Public
 */
router.get("/", async (req: Request, res: Response) => {
  try {

    const characters = await CharactersTest
      .find({ user_id : req.body.user_id })
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

console.log("[GET] maincard API 불러오기 성공");

module.exports = router;