import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import Character from "../models/Character";
import Userdata from "../models/Userdata";

const router = Router();

/**
 *  @route GET other/
 *  @desc Get all characters 
 *  @access Public
 */
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    console.log("[/other] 구경하기 시도");
    const userdata = await Userdata.find({ user_id : req.body.user.id })

    const characters = await Character
    .find({ characterPrivacy : false })
    .sort({ recentActivityTime : -1 })
    .select({  _id: 0, activity : 0 })
    .limit(30);

    if (!characters) {
      console.log("[/other] 캐릭터 데이터 없음");
      return res.status(400).json({
        status: 400,
        success: false,
        message: "캐릭터가 존재 하지 않습니다.",
        data: null,
      });
    }

    console.log("[/other] 구경하기 데이터 가져오기 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "구경하기 데이터 가져오기 성공",
      data: characters,
    });

  } catch (error) {
    console.error(error.message);
    console.log("[/other] 구경하기 데이터 가져오기 실패");
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
    console.log("[/other/detail] 구경하기 캐릭터 상세보기 시도");

    const { user_id, characterIndex} = req.params;

    const character = await Character
    .findOne({ user_id : user_id, characterIndex : Number(characterIndex)})
    .select({  _id: 0 })

    if (!character) {
      console.log("[/other/detail] 캐릭터 데이터 없음");
      return res.status(400).json({
        status: 400,
        success: false,
        message: "캐릭터 데이터가 존재 하지 않습니다.",
        data: null,
      });
    }

    console.log("[/other/detail] 구경하기 캐릭터 상세정보 가져오기 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "구경하기 캐릭터 상세정보 가져오기 성공",
      data: character,
    });

  } catch (error) {
    console.error(error.message);
    console.log("[/other/detail] 구경하기 캐릭터 상세정보 가져오기 실패");
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

module.exports = router;