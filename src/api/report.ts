import { Router, Request, Response } from "express";
import auth from "../middleware/auth";
const logger = require("../modules/logger");
const router = Router();
const moment = require("moment");
const reportService = require("../services/reportService");
const sc = require("../modules/statusCode");
const rm = require("../modules/responseMessage");
/**
 *  @route GET report/
 *  @desc Get all activities
 *  @access Public
 */
router.get(
  "/:activityYear/:activityMonth",
  auth,
  async (req: Request, res: Response) => {
    const activityYear = req.params.activityYear;
    const activityMonth = req.params.activityMonth;
    const user_id = req.body.user.id;
    try {
      const time = moment();
      var logTime = time.format("HH:mm:ss");
      console.log(logger.TRY_REPORT, "[", logTime, "]");

      const monthActivities = await reportService.getActivitiesOfMonth(
        user_id,
        activityYear,
        activityMonth
      );

      if (!monthActivities) {
        console.log(logger.FAIL_REPORT, "[", logTime, "]");
        return res.status(sc.EMPTY).send();
      }

      // 해당 월 날마다의 베스트 캐릭터 인덱스를 구함
      const dailyCharacter = await reportService.getDailyBestCharacter(
        user_id,
        activityYear,
        activityMonth
      );

      // 해당 월 베스트 캐릭터 인덱스를 구함 = modeM
      const monthlyCharacterIndex = await reportService.getMonthlyBestCharacter(
        user_id,
        activityYear,
        activityMonth
      );

      // 해당 월의 베스트 캐릭터 정보
      const monthlyCharacterInfo =
        await reportService.getMonthlyBestCharacterInfo(
          user_id,
          monthlyCharacterIndex
        );

      // 그 캐릭터의 캐칭수
      const catching = monthlyCharacterInfo["activityCount"];

      // 캐릭터 인덱스마다의 레벨 가져오기
      const charactersLevel = await reportService.getCharactersLevel(user_id);

      console.log(logger.OK_REPORT, "[", logTime, "]");
      return res.status(sc.OK).send({
        message: rm.REPORT_OK,
        characterName: monthlyCharacterInfo.characterName,
        characterIndex: monthlyCharacterInfo.characterIndex,
        characterImageIndex: monthlyCharacterInfo.characterImageIndex,
        characterLevel: monthlyCharacterInfo.characterLevel,
        catching,
        monthActivities,
        dailyCharacter,
        charactersLevel,
      });
    } catch (error) {
      console.log(logger.FAIL_REPORT, "[", logTime, "]");
      console.error(error.message);
      res.status(sc.SERVER_ERROR).send();
    }
  }
);

console.log("report API 불러오기 성공");
module.exports = router;
