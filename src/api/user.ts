import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { check, validationResult } from "express-validator";

const router = express.Router();

import UserData from "../models/Userdata";
import auth from "../middleware/auth";

/**
 *  @route Post api/auth
 *  @desc Authenticate user & get token(로그인)
 *  @access Public
 */
router.post(
  "/login",
  // [
  //   check("email", "Please include a valid email").isEmail(),
  //   check("password", "Password is required").exists(),
  // ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    console.log("출력해보자", req.body);

    try {
      let user = await UserData.findOne({ email });

      // 없는 유저
      if (!user) {
        res.status(400).json({
          errors: [{ msg: "Invalid Credentials" }],
        });
      }
      // Encrpyt password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("야야", password, user.password);

      // 비밀번호 일치하지 않음
      if (!isMatch) {
        res.status(400).json({
          errors: [{ msg: "Invalid Credentials" }],
        });
      }
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          email: user.email,
        },
      };
      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: "14d" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
