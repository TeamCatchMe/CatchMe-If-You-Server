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
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const getDateString = require("../modules/getDate");
const CharacterTest_1 = __importDefault(require("../models/CharacterTest"));
const router = express_1.Router();
/**
 *  @route GET maincard/
 *  @desc Get all characters (최근 활동순)
 *  @access Public
 */
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const characters = yield CharacterTest_1.default
            .find({ user_id: req.body.user_id }) // 컬렉션의 user_id 속성은 나중에 캐릭터 생성 시 넘겨주는 유저 정보로 수정
            .sort({ "activityDate": -1 })
            .limit(10);
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
        console.log("캐릭터 목록 불러오기 성공");
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
/**
 *  @route GET maincard/most
 *  @desc Get all characters (최다 활동순)
 *  @access Public
 */
// 유저 캐릭터 별 activity count 해서 sorting 
router.get("/most", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const characters = yield CharacterTest_1.default
            .find({ user_id: req.body.user_id }) // 컬렉션의 user_id 속성은 나중에 캐릭터 생성 시 넘겨주는 유저 정보로 수정
            .sort({ "activityDate": -1 })
            .limit(10);
        if (!characters) {
            return res.status(400).json(null);
        }
        res.json({
            "status": 200,
            "success": true,
            "message": "최다활동순 캐릭터 목록 가져오기 성공",
            "data": {
                "characters": characters
            }
        });
        console.log("캐릭터 목록 불러오기 성공");
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
/**
 *  @route GET maincard/recent
 *  @desc Get all characters (최근 캐릭터 생성순)
 *  @access Public
 */
// characterBirth(yyyymmdd)로 sorting
router.get("/recent", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const characters = yield CharacterTest_1.default
            .find({ user_id: req.body.user_id }) // 컬렉션의 user_id 속성은 나중에 캐릭터 생성 시 넘겨주는 유저 정보로 수정
            .sort({ "characterBirth": -1 })
            .limit(10);
        if (!characters) {
            return res.status(400).json(null);
        }
        res.json({
            "status": 200,
            "success": true,
            "message": "최근생성순 캐릭터 목록 가져오기 성공",
            "data": {
                "characters": characters
            }
        });
        console.log("캐릭터 목록 불러오기 성공");
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
/**
 *  @route Post main-card/create
 *  @desc Create new character
 *  @access Public
 */
router.post("/create", [
    express_validator_1.check("characterName", "characterName is required").exists(),
    express_validator_1.check("characterPrivacy", "characterPrivacy is required").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // 마지막 캐릭터 where 선언
    // 첫 생성시에는 예외처리 
    const { characterName, 
    // characterIndex,
    characterImageIndex, characterPrivacy } = req.body;
    const characterBirth = getDateString.nowDate;
    try {
        // const user = await Userdata.findById(req.body.user.id).select("-password");
        const newCharacter = new CharacterTest_1.default({
            user_id: req.body.email,
            characterName: characterName,
            characterIndex: 1,
            characterImageIndex: characterImageIndex,
            characterPrivacy: characterPrivacy,
            characterLevel: 1,
            characterBirth: characterBirth
        });
        yield newCharacter.save();
        return res.status(200).json({
            status: 200,
            success: true,
            message: "캐릭터 생성 성공",
            data: {
                "createdCharacter": newCharacter
            }
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({
            status: 500,
            success: false,
            message: "서버 내부 오류",
        });
    }
}));
console.log("maincard API 불러오기 성공");
module.exports = router;
//# sourceMappingURL=main-card.js.map