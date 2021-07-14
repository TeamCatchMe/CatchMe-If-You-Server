import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import Character from "../models/Character";

const router = Router();

/**
 *  @route GET other/
 *  @desc Get all characters 
 *  @access Public
 */
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    console.log("[구경하기 시도]");
    const characters = await Character
    .find()
    .sort({ recentActivityTime : -1 })
    .select({ user_id: 0, _id: 0, activity : 0 })
    .limit(30);

    if (!characters) {
      console.log("[구경하기 실패] 캐릭터 데이터 없음");
      return res.status(400).json({
        status: 400,
        success: false,
        message: "캐릭터가 존재 하지 않습니다.",
        data: null,
      });
    }

    console.log("구경하기 데이터 가져오기 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "구경하기 데이터 가져오기 성공",
      data: characters,
    });

  } catch (error) {
    console.error(error.message);
    console.log("구경하기 데이터 가져오기 실패");
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

/**
 *  @route GET other/detail
 *  @desc Get all characters 
 *  @access Public
 */
 router.get("/detail", auth, async (req: Request, res: Response) => {
  try {
    console.log("[구경하기 시도]");
    const characters = await Character
    .find()
    .sort({ recentActivityTime : -1 })
    .select({ user_id: 0, _id: 0, activity : 0 })
    .limit(30);

    if (!characters) {
      console.log("[구경하기 실패] 캐릭터 데이터 없음");
      return res.status(400).json({
        status: 400,
        success: false,
        message: "캐릭터가 존재 하지 않습니다.",
        data: null,
      });
    }

    console.log("구경하기 데이터 가져오기 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "구경하기 데이터 가져오기 성공",
      data: characters,
    });

  } catch (error) {
    console.error(error.message);
    console.log("구경하기 데이터 가져오기 실패");
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

module.exports = router;