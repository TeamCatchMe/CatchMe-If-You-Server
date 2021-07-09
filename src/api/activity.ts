import express from "express";
import auth from "../middleware/auth";
import upload from "../utils/s3";

import Activity from "../models/Activity";
import Character from "../models/Character";

const moment = require("moment");
const router = express.Router();

/**
 *  @route Post user/activity/add
 *  @desc create new activity
 *  @access Public
 */

//updateOne, image 업로드

router.post("/add", auth, async (req, res) => {
  const lastActivity = await Activity.find({ user_id: req.body.user.id })
    .sort({ _id: -1 })
    .select({ user_id: 0, _id: 0 });

  const time = moment();

  var activityIndex = lastActivity[0]["activityIndex"] + 1;
  // var activityBirth = time.format("YYYYMMDDHHmmss");

  const { activityContent, activityDate, characterIndex } = req.body;
  // const activivityImage = req.file.location
  try {
    const newActivity = new Activity({
      user_id: req.body.user.id,
      activityIndex: activityIndex,
      activityContent: activityContent,
      activityDate: activityDate,
      characterIndex: characterIndex,
    });

    await newActivity.save();

    // await Character.updateOne({ user_id: req.body.user.id, characterIndex: req.body.characterIndex }, {ResentActivityTime: activityBirth});

    return res.status(200).json({
      status: 200,
      success: true,
      message: "캐릭터 생성 성공",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

module.exports = router;
