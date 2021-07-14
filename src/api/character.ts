import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
import Character from "../models/Character";
const router = Router();

/**
 *  @route GET character/
 *  @desc Get character information and all activities
 *  @access Public
 */

router.get("/:characterIndex", auth ,async (req: Request, res: Response) => {
  try {
    console.log("[/character] 캐릭터 상세정보 가져오기 시도");
    var allActivitiesCount = 0;
    const characterIndex = req.params.characterIndex;

    // req.body 의 characterIndex를 가지는 캐릭터의 데이터를 가져옵니다. (객체)

    const character = await Character
    .findOne({ user_id : req.body.user.id, characterIndex : Number(characterIndex)})
    .select({ user_id : 0, _id : 0 });

    var characterActivitiesCount = character["activityCount"];
    var catchRate = 0;

    if (!character) {
      console.log("[/character] 통신 성공, 캐릭터 데이터 없음");
      res.status(400).json({
        status: 400,
        success: false,
        message: "캐릭터 데이터가 존재 하지 않는다. 미안.",
      });
    }

    if (character["activityCount"] == 0) {
      console.log("[/character] 통신 성공, 당월 게시글 데이터 없음");
      return res.status(200).json({
        status: 200,
        success: true,
        message: "통신성공, 당월 게시글이 존재하지 않습니다.",
        data: {
          character,
          characterActivitiesCount,
          catchRate
        }
      });
    }

    // 전체 캐릭터의 전체 게시글을 가져옵니다.
    const allActivities = await Character
    .find({ user_id : req.body.user.id })
    .sort({ activityYear : -1, activityMonth : -1 });
    
    // 전체 캐릭터가 쓴 게시글의 총 개수를 구합니다.
    for (var i = 0; i < allActivities.length; i++) {
      allActivitiesCount += allActivities[i]["activityCount"];
    }

    catchRate = Math.floor(characterActivitiesCount / allActivitiesCount * 100);
    
    console.log("[/character] <", character['characterName'], "> 님의 상세정보 불러오기 성공");

    return res.status(200).json({
      status: 200,
      success: true,
      message: "캐릭터 상세정보 불러오기 성공",
      data: {
        character,
        characterActivitiesCount,
        catchRate
      },
    });
  } catch (error) {
    console.log("캐릭터 상세정보 불러오기 실패");
    console.error(error.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});


/**
 *  @route Post character/edit
 *  @desc edit character info
 *  @access Public
 */
 router.post("/edit", auth, async (req, res) => {

  const { characterIndex, characterName, characterPrivacy } = req.body;

  try {
    console.log("[/character/edit] 캐릭터 수정 시도");

    // 수정할 값들을 바탕으로 데이터를 수정해준다.
    await Character.findOneAndUpdate(
      {
        user_id: req.body.user.id,
        characterIndex: characterIndex,
      },
      {
        characterName: characterName,
        characterPrivacy : characterPrivacy,
      }
    );

    console.log("[수정된 데이터] \n", {
      characterName: characterName,
      characterPrivacy : characterPrivacy,
    });

    console.log("[/character/edit] 캐릭터 수정 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "캐릭터 수정 성공",
    });
  } catch (err) {
    console.log("[/character/edit] 캐릭터 수정 실패 - 서버 내부 오류 (500)");
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

console.log("character API 불러오기 성공");
module.exports = router;
