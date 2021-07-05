import { Router, Request, Response } from "express";


import Test from "../models/test";

const router = Router();

/**
 *  @route GET api/profile
 *  @desc Get all profiles
 *  @access Public
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const test = await Test.find();

        if (!test.length) {
            return res.status(200).json({ status: 200, success : true, message: "test 데이터 없음", data: test });
          }
          res.json({status: 200, success: true, message: "test 데이터 가져오기 성공", data: test});
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ status: 500, success: false, message: "서버 내부 에러" });
    }
});

module.exports = router;
