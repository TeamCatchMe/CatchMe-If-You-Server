"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_1 = __importDefault(require("../models/test"));
const router = express_1.Router();
/**
 *  @route GET api/profile
 *  @desc Get all profiles
 *  @access Pßublic
 */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const test = yield test_1.default.find();
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
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send({
            status: 500,
            success: false,
            message: "서버 탓 아니쥬??? ㅎㅎ ",
        });
    }
}));
module.exports = router;
//# sourceMappingURL=test.js.map