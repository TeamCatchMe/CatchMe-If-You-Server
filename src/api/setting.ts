import express from "express";
import auth from "../middleware/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";

const router = express.Router();

import UserData from "../models/Userdata";

/**
 *  @route Post user/editnickname
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

module.exports = router;
