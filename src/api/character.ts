import { Router, Request, Response } from "express";
import auth from "../middleware/auth"
import Character from "../models/Character";
const router = Router();

/**
 *  @route GET character/
 *  @desc Get character information and all activities
 *  @access Public
 */
router.get("/", auth ,async (req: Request, res: Response) => {
  try {
    console.log("[/character] 캐릭터 상세정보 가져오기 시도");
    var allActivitiesCount = 0;
    const { characterIndex } = req.body;

    // req.body 의 characterIndex를 가지는 캐릭터의 데이터를 가져옵니다. (객체)
    const character = await Character
    .findOne({ user_id : req.body.user.id, characterIndex : characterIndex})
    .select({ user_id : 0, _id : 0 });

    if ( character['activityCount'] == 0 ) {
      console.log("통신 성공, 당월 게시글 데이터 없음.");
      return res.status(200).json({
        "status" : 200,
        "success" : true,
        "message" : "통신성공, 당월 게시글이 존재하지 않습니다.",
        "data" : character
      });
    };

    // 전체 캐릭터의 전체 게시글을 가져옵니다.
    const allActivities = await Character
    .find({user_id : req.body.user.id})
    .sort({ activityYear : -1, activityMonth : -1 });
    
    // 전체 캐릭터가 쓴 게시글의 총 개수를 구합니다.
    for (var i = 0; i < allActivities.length; i++) {
      allActivitiesCount += allActivities[i]["activityCount"]
    };

    // 캐릭터가 쓴 게시글의 총 개수를 구합니다.
    const characterActivitiesCount = character["activityCount"];

    // 캐치지수 : 전체 활동중 해당 캐릭터의 활동 비율
    const catchRate = Math.floor(characterActivitiesCount / allActivitiesCount * 100);
    
    console.log(character['characterName'], "님의 상세정보 불러오기 성공");
    return res.status(200).json({
      "status" : 200,
      "success" : true,
      "message" : "캐릭터 상세정보 불러오기 성공",
      "data": {
        character,
        characterActivitiesCount,
        catchRate
      }
    });

  } catch (error) {
    console.log("캐릭터 상세정보 불러오기 실패");
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