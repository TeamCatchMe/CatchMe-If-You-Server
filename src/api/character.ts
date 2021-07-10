// 작업중
import { Router, Request, Response } from "express";
import auth from "../middleware/auth"
import Activity from "../models/Activity";
import Character from "../models/Character";

const moment = require('moment');
const router = Router();

/**
 *  @route GET character/
 *  @desc Get character information and all activities
 *  @access Public
 */
router.get("/", auth ,async (req: Request, res: Response) => {
  try {
  
    const time = moment();
    var month = time.format('MM');

    const character = await Character.findOne({ user_id : req.body.user.id, characterIndex : 6 }).select({ user_id : 0, _id : 0 });
    const { characterBirth, characterName, characterLevel, characterIndex } = character;

    const characterActivities = await Activity
      .find({ user_id : req.body.user.id, characterIndex : characterIndex})
      .select({ user_id : 0, _id : 0 });

    const allActivities = await Activity.find({user_id : req.body.user.id}).countDocuments();

    console.log(characterActivities);

    if ( characterActivities.length == 0 ) {
      return res.status(400).json({
        "status" : 400,
        "success" : false,
        "message" : characterName + "의 " + month + "월 게시글이 존재 하지 않습니다.",
        "data" : null
      });
    };
    
    // 캐치지수 : 전체 활동중 해당 캐릭터의 활동 비율
    const catchRate = characterActivities.length / allActivities * 100
    
    res.json({
      "status" : 200,
      "success" : true,
      "message" : "캐릭터 상세정보 불러오기 성공",
      "data": {
        characterBirth : characterBirth,
        characterName : characterName,
        characterLevel : characterLevel,
        catchRate : catchRate,
        activities : characterActivities
      }
    });
    
    console.log("월별 게시글 데이터 불러오기 성공");

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
        "status" : 500,
        "success" : false,
        "message" : "서버 내부 오류"
    });
  }
});

console.log("character API 불러오기 성공");
module.exports = router;