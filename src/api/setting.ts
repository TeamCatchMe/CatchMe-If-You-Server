import express from "express";
import auth from "../middleware/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";

const router = express.Router();

import UserData from "../models/Userdata";

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
        success: true,
        message: "현재와 같은 닉네임",
      });
    }
    await UserData.findOneAndUpdate(
      { _id: req.body.user.id },
      { nickname: req.body.nickname }
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
        status: 400,
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
    console.log("[/setting/withdraw] 회원탈퇴");

    var password = req.body.password;

    let user = await UserData.findOne({ _id: req.body.user.id });

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

module.exports = router;
