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
  try {//4,6
    var max = 0;

    const time = moment();
    // var year = time.format('YYYY');
    // var month = time.format('MM');

    const { activityYear, activityMonth, activityDay} = req.body;

    // 필요 : 1) 해당년월의 게시글 전부 2) 그 달의 베스트 캐릭터 정보
    // xxxx년 xx월의 모든 게시글 가져오기 = activities (Array) / activities : activityYear, activity : activityMonth 
    const activities = await Character
    .find(
      { user_id : req.body.user.id }, 
      {"activity" : { $elemMatch : {activityYear : activityYear, activityMonth : activityMonth, activityDay : activityDay}}}
      )


    // .find({ $and : [
    //                 { "user_id" : req.body.user.id },
    //                 { "activity" : { "$elemMatch" : { "activityYear" :  "2021", "activityMonth" :  "07" } } }
    //     ]})
      // .activityYear === '2021' 
      // { "activity" : { "$elemMatch" : { "activityYear" === "2021", "activityMonth" === "07" } } }
      // .sort({ activityDay : 1 }) // 일별로 정렬
      // .select({  _id : 0 }); 
    console.log(activities[0]);

    for (var i = 0; i < activities.length; i++) {
      if ( max < activities[i]["activity"].length) { max = activities[i]["characterIndex"] }
    }

    // 해당 월의 베스트 캐릭터, 그리고 그 캐릭터의 캐칭수
    const characterOfMonth = await Character
    .findOne({user_id : req.body.user.id, characterIndex : max, }, { _id : false })
    .select({ user_id : 0, _id : 0 });
    // console.log(characterOfMonth);

    const catching = characterOfMonth['activity'].length;

    if ( activities.length == 0 ) {
      return res.status(400).json({
        "status" : 400,
        "success" : false,
        "message" : activityMonth + "월의 게시글이 존재 하지 않습니다.",
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
        activities,
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