import { Router, Request, Response } from "express";
import auth from "../middleware/auth"
import Activity from "../models/Activity";
import Character from "../models/Character";

const router = Router();

/**
 *  @route GET report/
 *  @desc Get all activities
 *  @access Public
 */
router.get("/", auth ,async (req: Request, res: Response) => {
  try {
    var max = 0;

    const { activityYear, activityMonth } = req.body;

    // xxxx년 xx월의 모든 게시글 가져오기 = activities (Array) 
    const activitiesOfMonth = await Activity
    .find( { user_id : req.body.user.id, activityYear: activityYear, activityMonth : activityMonth } )

    // 게시글 작성 수로 내림차순 정렬 (Array)
    const character = await Character
    .findOne({user_id : req.body.user.id})
    .sort({activityCount : -1})

    // 게시글 제일 많은 캐릭터의 인덱스
    max = character['characterIndex'];
  
    // 해당 월의 베스트 캐릭터 정보
    const characterOfMonth = await Character
    .findOne({user_id : req.body.user.id, characterIndex : max, }, { _id : false, activity: false })
    .select({ user_id : 0, _id : 0 });
    
    // 그 캐릭터의 캐칭수
    const catching = characterOfMonth['activityCount'];

    if ( activitiesOfMonth.length == 0 ) {
      return res.status(400).json({
        "status" : 400,
        "success" : false,
        "message" : activityYear + "년 " + activityMonth + "월의 게시글이 존재 하지 않습니다.",
        "data" : null
      });
    };

    console.log("월별 게시글 데이터 불러오기 성공");
    return res.status(200).json({
      "status" : 200,
      "success" : true,
      "message" : "월별 게시글 데이터 불러오기 성공",
      "data": {
        characterOfMonth,
        catching,
        activitiesOfMonth,
      }
    });
    
  } catch (error) {
    console.log("월별 게시글 데이터 불러오기 실패");
    console.error(error.message);
    res.status(500).json({
        "status" : 500,
        "success" : false,
        "message" : "서버 내부 오류"
    });
  }
});

console.log("report API 불러오기 성공");
module.exports = router;