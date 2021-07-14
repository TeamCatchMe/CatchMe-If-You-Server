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
router.get("/:activityYear/:activityMonth", auth ,async (req: Request, res: Response) => {
  try {
    console.log("[/report] 리포트 데이터 불러오기 시도");
    var characterIndexArr = [];
    const activityYear = req.params.activityYear;
    const activityMonth = req.params.activityMonth;

    // xxxx년 xx월의 모든 게시글 가져오기 = activities (Array) 
    const activitiesOfMonth = await Activity
    .find({ user_id : req.body.user.id, activityYear: activityYear, activityMonth : activityMonth })
    .select({ user_id : 0, _id : 0, activityImage : 0, activityContent : 0, activityImageName : 0 })
    .sort({ activityDay : 1 });

    if ( activitiesOfMonth.length == 0 ) {
      return res.status(400).json({
        "status" : 400,
        "success" : false,
        "message" : activityYear + "년 " + activityMonth + "월의 게시글이 존재 하지 않습니다.",
        "data" : null
      });
    }

    // 해당 월 날마다의 베스트 캐릭터 인덱스를 구함
    const activities = await Activity
    .aggregate([
      { $group : 
        { _id : { 
          "activityYear" : "$activityYear", 
          "activityMonth" : "$activityMonth", 
          "activityDay" : "$activityDay"}, 
        characterIndexArray: { $push:"$characterIndex" } } 
      }
    ]).sort({ "_id.activityDay" : 1 });

    for ( var i = 0; i<activities.length; i++ ) {
      const countsDay = activities[i]['characterIndexArray'].reduce((pv, cv)=>{ 
        pv[cv] = (pv[cv] || 0) + 1; 
        return pv; 
      }, {});
      const keys = Object.keys(countsDay); 
      let mode = keys[0]; 
      keys.forEach((val, idx)=>{ 
        if(countsDay[val] > countsDay[mode]){
          mode = val; 
        } 
      });
      characterIndexArr.push(Number(mode));
    }

    // 해당 월 베스트 캐릭터 인덱스를 구함 = modeM
    const character = await Activity
    .aggregate([
      { $group : 
        { _id : { 
          "activityYear" : "$activityYear", 
          "activityMonth" : "$activityMonth" }, 
        characterIndexArray: { $push:"$characterIndex" } } 
      }
    ])

    const countsMonth = character[0]['characterIndexArray'].reduce((pv, cv)=>{ 
      pv[cv] = (pv[cv] || 0) + 1; 
      return pv; 
    }, {});

    const keys = Object.keys(countsMonth); 
    let modeM = keys[0]; 
    keys.forEach((val, idx)=>{ 
      if(countsMonth[val] > countsMonth[modeM]){
        modeM = val; 
      } 
    });

    // 해당 월의 베스트 캐릭터 정보 
    const characterOfMonth = await Character
    .findOne({user_id : req.body.user.id, characterIndex : Number(modeM) }, { _id : false, activity: false })
    .select({ user_id : 0, _id : 0 });
    
    // 그 캐릭터의 캐칭수
    const catching = characterOfMonth['activityCount'];
    console.log(characterOfMonth);

    // 캐릭터 인덱스마다의 레벨 가져오기
    const characterInfo = await Character
    .find({user_id : req.body.user.id}, {_id : false, characterLevel : true })
    var characterLevelArr = [];
    for (var j = 0; j<characterInfo.length; j++) {
      characterLevelArr.push(characterInfo[j]["characterLevel"])  
    }

    console.log("[/report] 월별 게시글 데이터 불러오기 성공");
    return res.status(200).json({
      "status" : 200,
      "success" : true,
      "message" : "월별 게시글 데이터 불러오기 성공",
      "data": {
        characterName : characterOfMonth.characterName,
        characterIndex : characterOfMonth.characterIndex,
        characterImageIndex : characterOfMonth.characterImageIndex,
        characterLevel : characterOfMonth.characterLevel,
        catching,
        activitiesOfMonth,
        characterIndexArr,
        characterLevelArr
      }
    });
    
  } catch (error) {
    console.log("[/report] 월별 게시글 데이터 불러오기 실패");
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

