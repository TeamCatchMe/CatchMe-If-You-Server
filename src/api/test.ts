import { Router, Request, Response } from "express";

import Test from "../models/test";

const router = Router();

/**
 *  @route GET api/profile
 *  @desc Get all profiles
 *  @access Pßublic
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const test = await Test.find();

    if (!test.length) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "데이터 어,림도 없쥬ㅠ?? ㅎㅎ",
        data: test,
      });
    }
    res.json({
      status: 200,
      success: true,
      message: "용켸 성,,공하셨.읍디댜???? ^00^",
      data: test,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      status: 500,
      success: false,
      message: "서버 탓 아니쥬??? ㅎㅎ ",
    });
  }
});

module.exports = router;