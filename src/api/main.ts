import express from "express";
import auth from "../middleware/auth";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import { check, validationResult } from "express-validator";

const router = express.Router();

import UserData from "../models/Userdata";
import CharactersTest from "../models/CharacterTest";

/*
 *  @route GET /main
 *  @desc Test Route
 *  @access Public
 */
router.get("/", auth, async function (req, res) {
  try {
    console.log(req.body.user.id);
    const user = await UserData.findById(req.body.user.id).select("-password");
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Err");
  }
});

module.exports = router;
