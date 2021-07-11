import express from "express";
import auth from "../middleware/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { check, validationResult } from "express-validator";

const router = express.Router();

import UserData from "../models/Userdata";
import Character from "../models/Character";

/*
 *  @route GET /main
 *  @desc Test Route
 *  @access Public
 */
router.get("/", auth, async function (req, res) {
  try {
    const data = await Character.find({
      user_id: req.body.user.id,
    })
      .select({ user_id: 0, _id: 0, activity: 0 })
      .sort({ ResentActivityTime: -1 })
      .limit(5);

    // report 값을 data에 넣어서 보내주려면, model, interface 다 손 봐줘야할 것 같은데..?
    // 아마 required 값 없이 틀만 잡아주고, res에 담아 보낼때만 쓰는 용도로?
    // 이거는 내일 세훈이랑 만나서 얘기하자

    return res.json({
      status: 200,
      success: true,
      message: "게시글 생성 성공",
      data,
      // 세훈아 우리 값 이런식으로 전달해주는게 좋을 것 같아
      // 이전에는 data : {user} 이런식으로 해놨었는데, 그렇게 되면 클라가 값 가져다 쓰기에 불편해서!
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Err");
  }
});

module.exports = router;
