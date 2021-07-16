import express from "express";
import auth from "../middleware/auth";
import bcrypt from "bcryptjs";

const AWS = require("aws-sdk");
let s3 = new AWS.S3();
AWS.config.loadFromPath(__dirname + "/../../awsconfig.json");

const router = express.Router();
const logger = require("../modules/logger");
const moment = require("moment");

import UserData from "../models/Userdata";
import Character from "../models/Character";
import Activity from "../models/Activity";

/**
 *  @route Post setting/editnickname
 *  @desc edit nickname
 *  @access Public
 */
router.post("/nickname", auth, async (req, res) => {
  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");

    console.log(logger.TRY_SETTING_NICKNAME, "[", logTime, "]");

    const nicknameCheck = await UserData.find({
      _id: req.body.user.id,
      nickname: req.body.nickname,
    }).count();

    if (nicknameCheck == 1) {
      console.log(
        logger.OK_SETTING_NICKNAME,
        "[현재와 같은 닉네임] -",
        req.body.nickname,
        "[",
        logTime,
        "]"
      );
      return res.status(200).json({
        status: 200,
        success: false,
        message: "현재와 같은 닉네임",
      });
    }
    await UserData.findOneAndUpdate(
      { _id: req.body.user.id },
      { nickname: req.body.nickname }
    );

    await Character.updateMany(
      { user_id: req.body.user.id },
      { user_nickname: req.body.nickname }
    );

    console.log(
      logger.OK_SETTING_NICKNAME,
      "[",
      req.body.nickname,
      "]로 변경됨 ",
      "[",
      logTime,
      "]"
    );
    return res.status(200).json({
      status: 200,
      success: true,
      message: "닉네임 수정 완료",
    });
  } catch (err) {
    console.log(logger.FAIL_SETTING_NICKNAME, "[", logTime, "]");
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

/**
 *  @route Post setting/passwordcheck
 *  @desc password check
 *  @access Public
 */
router.post("/passwordcheck", auth, async (req, res) => {
  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");

    console.log(logger.TRY_SETTING_PASSWORD, "[", logTime, "]");

    const password = req.body.password;
    let user = await UserData.findOne({ _id: req.body.user.id });

    const isMatch = await bcrypt.compare(password, user.password);

    // 비밀번호 일치하지 않음
    if (!isMatch) {
      console.log(
        logger.FAIL_SETTING_PASSWORD,
        "[비밀번호 불일치]",
        "[",
        logTime,
        "]"
      );
      res.status(400).json({
        status: 200,
        success: false,
        message: "현재 비밀번호와 일치하지 않습니다.",
        data: {
          check: "false",
        },
      });
    }

    console.log(logger.OK_SETTING_PASSWORD, "[", logTime, "]");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "현재 비밀번호와 일치합니다",
      data: {
        check: "true",
      },
    });
  } catch (err) {
    console.log(logger.FAIL_SETTING_PASSWORD, "[", logTime, "]");
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

/**
 *  @route Post setting/password
 *  @desc edit password
 *  @access Public
 */
router.post("/password", auth, async (req, res) => {
  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");

    console.log(logger.TRY_SETTING_CHANGE_PASSWORD, "[", logTime, "]");
    var password = req.body.password;

    // 현재 password를 찾아와 비교
    let user = await UserData.findOne({ _id: req.body.user.id });
    const isMatch = await bcrypt.compare(password, user.password);

    // password 일치하는 경우
    if (isMatch) {
      console.log(
        logger.OK_SETTING__CHANGE_PASSWORD,
        "[현재와 같은 비밀번호]",
        "[",
        logTime,
        "]"
      );
      res.status(200).json({
        status: 200,
        success: false,
        message: "현재 비밀번호와 똑같습니다.",
      });
    }

    // password 암호화
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // password 업데이트
    await UserData.findOneAndUpdate(
      { _id: req.body.user.id },
      { password: password }
    );

    console.log(logger.OK_SETTING__CHANGE_PASSWORD, "[", logTime, "]");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "비밀번호 변경 성공",
    });
  } catch (err) {
    console.log(logger.FAIL_SETTING__CHANGE_PASSWORD, "[", logTime, "]");
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

/**
 *  @route Post setting/withdraw
 *  @desc delete account - 화원탈퇴
 *  @access Public
 */
router.post("/withdraw", auth, async (req, res) => {
  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");

    console.log(logger.TRY_SETTING_WITHDRAW, "[", logTime, "]");

    const deletedUser = await UserData.findOneAndDelete({
      _id: req.body.user.id,
    });
    console.log("[삭제 된 계정] : ", deletedUser.nickname);
    console.log(
      "[삭제 된 캐릭터]",
      await Character.find({
        user_id: req.body.user.id,
      })
    );
    await Character.deleteMany({
      user_id: req.body.user.id,
    });

    const activityImagetest = await Activity.aggregate([
      {
        $match: {
          user_id: req.body.user.id,
          activityImageName: {
            $exists: true,
            $ne: null,
          },
        },
      },
      { $project: { activityImageName: 1, _id: 0 } },
    ]);

    // 삭제할 image Key 배열 선언
    var keyArray = [];
    for (var i = 0; i < activityImagetest.length; i++) {
      var keyObject = new Object();
      keyObject["Key"] = activityImagetest[0]["activityImageName"];
      keyArray.push(keyObject);
    }

    // 이미지 삭제시도 (object에 위에서 만든 배열을 넣어준다.)
    // keyarray에 있는 이미지들이 동시에 삭제된다.
    var params = {
      Bucket: "catchmeserver",
      Delete: {
        Objects: keyArray,
        Quiet: false,
      },
    };
    s3.deleteObjects(params, function (err, data) {
      if (err) console.log(err, err.stack);
      // an error occurred
      else console.log(data); // successful response
    });

    // 삭제할 액티비티 출력
    console.log(
      "[삭제된 액티비티]",
      await Activity.find({
        user_id: req.body.user.id,
      })
    );

    // 해당 계정에 있는 activity를 전부 삭제
    await Activity.deleteMany({
      user_id: req.body.user.id,
    });

    console.log(logger.OK_SETTING_WITHDRAW, "[", logTime, "]");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "회원 탈퇴 성공",
    });
  } catch (err) {
    console.log(logger.FAIL_SETTING_WITHDRAW, "[", logTime, "]");
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

module.exports = router;
