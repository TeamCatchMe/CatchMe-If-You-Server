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
const Character_1 = __importDefault(require("../models/Character"));
const router = express_1.Router();
/**
 *  @route GET maincard/
 *  @desc Get all characters (최근활동순)
 *  @access Public
 */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const characters = yield Character_1.default.findOne({
            user: req.body.user_id, // sorting 조건 추가하기
        });
        if (!characters) {
            return res.status(400).json(null);
        }
        res.json({
            "status": 200,
            "success": true,
            "message": "최근활동순 캐릭터 목록 가져오기 성공",
            "data": {
                "characters": characters
            }
        });
        console.log("GET maincard/ 성공");
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({
            "status": 500,
            "success": false,
            "message": "서버 내부 오류"
        });
    }
}));
console.log("GET maincard/ 성공");
module.exports = router;
//# sourceMappingURL=main-card.js.map