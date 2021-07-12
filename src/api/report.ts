// 작업중

import { Router, Request, Response } from "express";
import auth from "../middleware/auth"
import Activity from "../models/Activity";
import Character from "../models/Character";

const moment = require('moment');
const router = Router();

/**
 *  @route GET report/
 *  @desc Get all activities (YYYYMM)
 *  @access Public
 */
router.get("/", auth ,async (req: Request, res: Response) => {
  try {
    var max = 0;

    const { activityYear, activityMonth } = req.body;

    // 필요 : 1) 해당년월의 게시글 전부 2) 그 달의 베스트 캐릭터 정보

    // xxxx년 xx월의 모든 게시글 가져오기 = activities (Array) 
    const activitiesOfMonth = await Activity
    .find( { user_id : req.body.user.id, activityYear: activityYear, activityMonth : activityMonth } )

    // 제일 게시글 수가 많은 캐릭터. 캐릭터 컬렉션에서 얻어와야함
    const character = await Character
    .findOne({user_id : req.body.user.id})
    .sort({activityCount : -1})

    max = character['characterIndex'];
  
    // 해당 월의 베스트 캐릭터, 그리고 그 캐릭터의 캐칭수
    const characterOfMonth = await Activity
    .find({user_id : req.body.user.id, characterIndex : max, }, { _id : false })
    .select({ user_id : 0, _id : 0 });
    
    const catching = characterOfMonth.length;

    if ( activitiesOfMonth.length == 0 ) {
      return res.status(400).json({
        "status" : 400,
        "success" : false,
        "message" : activityYear + "년 " + activityMonth + "월의 게시글이 존재 하지 않습니다.",
        "data" : null
      });
    };

    res.json({
      "status" : 200,
      "success" : true,
      "message" : "월별 게시글 데이터 불러오기 성공",
      "data": {
        characterOfMonth,
        catching,
        activitiesOfMonth,
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

console.log("report API 불러오기 성공");
module.exports = router;