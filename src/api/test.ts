import { Router, Request, Response } from "express";
import request from "request";
import config from "../config";

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
        res.json(test);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
