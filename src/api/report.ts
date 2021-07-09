// 작업중

import { Router, Request, Response } from "express";
import auth from "../middleware/auth"
import Character from "../models/Character";

const moment = require('moment');
const router = Router();

/**
 *  @route GET report/
 *  @desc Get all characters (최근 활동순)
 *  @access Public
 */
router.get("/", auth ,async (req: Request, res: Response) => {
  try {//4,6
  
    const time = moment();
    var month = time.format('MM');

    const characters = await Character
      .find({ user_id : req.body.user.id}) //, activityDateMonth : month
      .select({ user_id : 0, _id : 0 });
    
    // const catching = characters.find( element => activityDate.slice(4,6) == month );

    console.log(characters);

    if (!characters) {
      return res.status(400).json({
        "status" : 400,
        "success" : false,
        "message" : "캐릭터가 존재 하지 않습니다.",
        "data" : null
      });
    };

    res.json({
      "status" : 200,
      "success" : true,
      "message" : "월별 게시글 데이터 불러오기 성공",
      "data": {
        "characters" : characters
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