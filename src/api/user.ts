import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { check, validationResult } from "express-validator";
const logger = require("../modules/logger");
const moment = require("moment");
const router = express.Router();
import UserData from "../models/Userdata";

/**
 *  @route Post user/login
 *  @desc Authenticate user & get token(로그인)
 *  @access Public
 */
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      const time = moment();

      var logTime = time.format("HH:mm:ss");
      console.log(logger.TRY_LOGIN, "[", logTime, "]");

      let user = await UserData.findOne({ email });
      // 없는 유저
      if ( !user ) {
        console.log("[/login] 로그인 실패 - 존재하지 않는 이메일");
        res.status(200).json({
          status: 200,
          success: false,
          message: "존재하지 않는 이메일 입니다.",
        });
      }
      // Encrpyt password
      const isMatch = await bcrypt.compare(password, user.password);

      // 비밀번호 일치하지 않음
      if ( !isMatch ) {
        console.log(logger.FAIL_LOGIN, "[", logTime, "]");
        res.status(200).json({
          status: 200,
          success: false,
          message: "비밀번호가 일치하지 않습니다.",
        });
      }

      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: "14d" },
        (err, token) => {
          if (err) throw err;
          console.log(
            logger.OK_LOGIN,
            " -- [",
            user.nickname,
            "]",
            " [",
            logTime,
            "]"
          );
          res.json({
            status: 200,
            success: true,
            message: "로그인 성공",
            data: { token, nickname: user.nickname },
          });
        }
      );
    } catch (err) {
      console.log(logger.FAIL_LOGIN, "[", logTime, "]");
      console.error(err.message);
      res.status(500).json({
        status: 500,
        success: false,
        message: "서버 내부 오류",
      });
    }
  }
);

/**
 *  @route Post user/signup
 *  @desc sign up new user
 *  @access Public
 */
router.post(
  "/signup",
  [
    check("email", "Please include a valid email").isEmail(),
    check("nickname", "Nickname is required").exists(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_SIGNUP, "[", logTime, "]");

    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, nickname, password } = req.body;

    try {
      const user = new UserData({
        email,
        password,
        nickname,
      });

      // password 암호화
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // db에 데이터 저장
      await user.save();
      console.log(logger.OK_SIGNUP, " -- [", nickname, "]", " [", logTime, "]");
      return res.status(200).json({
        status: 200,
        success: true,
        message: "회원가입 성공",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: 500,
        success: false,
        message: "서버 내부 오류",
      });
    }
  }
);

/**
 *  @route Post user/emailcheck
 *  @desc email duplicate check
 *  @access Public
 */
router.post(
  "/emailcheck",
  [check("email", "Please include a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const time = moment();
      var logTime = time.format("HH:mm:ss");
      console.log(logger.TRY_CHECK_EMAIL, "[", logTime, "]");

      const userdata = await UserData.find({ email: req.body.email }).count();

      if (userdata == 0) {
        console.log(logger.OK_CHECK_EMAIL, "[", logTime, "]");
        return res.status(200).json({
          status: 200,
          success: true,
          message: "사용 가능한 이메일 입니다.",
          data: {
            duplicate: "available",
          },
        });
      }

      console.log(logger.FAIL_CHECK_EMAIL, "[", logTime, "]");
      return res.status(200).json({
        status: 200,
        success: false,
        message: "이미 사용중인 이메일입니다.",
        data: {
          duplicate: "unavailable",
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        status: 500,
        success: false,
        message: "서버 내부 오류",
      });
    }
  }
);

module.exports = router;