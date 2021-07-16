import express from "express";
import auth from "../middleware/auth";
import bcrypt from "bcryptjs";

const AWS = require("aws-sdk");
let s3 = new AWS.S3();
AWS.config.loadFromPath(__dirname + "/../../awsconfig.json");

const router = express.Router();

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
    console.log("[/setting/nickname] 닉네임 변경 시도");

    const nicknameCheck = await UserData.find({
      _id: req.body.user.id,
      nickname: req.body.nickname,
    }).count();

    if (nicknameCheck == 1) {
      console.log(
        "[/setting/nickname] 닉네임 변경 실패 - 현재와 같은 닉네임   : ",
        req.body.nickname
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

    console.log("[/setting/nickname] 닉네임 변경 성공  : ", req.body.nickname);
    return res.status(200).json({
      status: 200,
      success: true,
      message: "닉네임 수정 완료",
    });
  } catch (err) {
    console.log("[/setting/nickname] 닉네임 변경 실패 - 서버 내부 오류");
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
    console.log("[/setting/passwordcheck] 현재 비밀번호 확인 시도");

    const password = req.body.password;
    let user = await UserData.findOne({ _id: req.body.user.id });

    const isMatch = await bcrypt.compare(password, user.password);

    // 비밀번호 일치하지 않음
    if (!isMatch) {
      console.log(
        "[/setting/passwordcheck] 비밀번호 확인 실패 - 비밀번호 불일치"
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

    console.log("[/setting/passwordcheck] 비밀번호 확인 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "현재 비밀번호와 일치합니다",
      data: {
        check: "true",
      },
    });
  } catch (err) {
    console.log("[/setting/passwordcheck] 비밀번호 확인 실패 - 서버 내부 오류");
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
    console.log("[/setting/password] 비밀번호 변경 시도");
    var password = req.body.password;

    // 현재 password를 찾아와 비교
    let user = await UserData.findOne({ _id: req.body.user.id });
    const isMatch = await bcrypt.compare(password, user.password);

    // password 일치하는 경우
    if (isMatch) {
      console.log(
        "[/setting/passwordcheck] 비밀번호 변경 실패 - 현재 비밀번호와 똑같음"
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

    console.log("[/setting/password] 비밀번호 변경 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "비밀번호 변경 성공",
    });
  } catch (err) {
    console.log("[/setting/password] 비밀번호 변경 실패 - 서버 내부 오류");
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
    console.log("[/setting/withdraw] 회원 탈퇴 시도");

    await UserData.deleteOne({
      _id: req.body.user.id,
    });

    console.log(
      "삭제 캐릭터",
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
      "삭제 액티비티",
      await Activity.find({
        user_id: req.body.user.id,
      })
    );

    // 해당 계정에 있는 activity를 전부 삭제
    await Activity.deleteMany({
      user_id: req.body.user.id,
    });

    console.log("[/setting/withdraw] 회원 탈퇴 성공");
    return res.status(200).json({
      status: 200,
      success: true,
      message: "회원 탈퇴 성공",
    });
  } catch (err) {
    console.log("[/setting/withdraw] 회원 탈퇴 실패 - 서버 내부 오류");
    console.error(err.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: "서버 내부 오류",
    });
  }
});

module.exports = router;
