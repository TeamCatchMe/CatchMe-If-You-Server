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
  
    const time = moment();
    var year = time.format('YYYY');
    var month = time.format('MM');

    const activities = await Activity
      .find({ user_id : req.body.user.id, activityYear : year, activityMonth : month})
      .select({ user_id : 0, _id : 0 }); // 7월에 해당하는 모든 게시글
    
    const characterOfMonth = await Activity
    .find({ user_id : req.body.user.id, activityYear : year, activityMonth : month}, { _id : false, characterIndex : true });

    console.log(characterOfMonth)
    
    // const catching = activities.length;
    // const catching = characters.find( element => activityDate.slice(4,6) == month );

    if ( activities.length == 0 ) {
      return res.status(400).json({
        "status" : 400,
        "success" : false,
        "message" : month + "월의 게시글이 존재 하지 않습니다.",
        "data" : null
      });
    };

    res.json({
      "status" : 200,
      "success" : true,
      "message" : "월별 게시글 데이터 불러오기 성공",
      "data": {
        activities,
        // catching,
        //characterOfMonth
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