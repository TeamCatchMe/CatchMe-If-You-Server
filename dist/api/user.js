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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const Userdata_1 = __importDefault(require("../models/Userdata"));
/**
 *  @route Post user/login
 *  @desc Authenticate user & get token(로그인)
 *  @access Public
 */
router.post("/login", [
    express_validator_1.check("email", "Please include a valid email").isEmail(),
    express_validator_1.check("password", "Password is required").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = yield Userdata_1.default.findOne({ email });
        // 없는 유저
        if (!user) {
            res.status(400).json({
                status: 400,
                success: false,
                message: "존재하지 않는 이메일 입니다.",
            });
        }
        // Encrpyt password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        // 비밀번호 일치하지 않음
        if (!isMatch) {
            res.status(400).json({
                status: 400,
                success: false,
                message: "비밀번호가 일치하지 않습니다.",
            });
        }
        yield user.save();
        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
            },
        };
        console.log(user.id, payload);
        jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: "14d" }, (err, token) => {
            if (err)
                throw err;
            res.json({
                status: 200,
                success: true,
                message: "로그인 성공",
                data: { token },
            });
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
/**
 *  @route Post user/signup
 *  @desc sign up new user
 *  @access Public
 */
router.post("/signup", [
    express_validator_1.check("email", "Please include a valid email").isEmail(),
    express_validator_1.check("nickname", "Nickname is required").exists(),
    express_validator_1.check("password", "Password is required").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, nickname, password } = req.body;
    try {
        const user = new Userdata_1.default({
            email,
            password,
            nickname,
        });
        // password 암호화
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(password, salt);
        // db에 데이터 저장
        yield user.save();
        return res.status(200).json({
            status: 200,
            success: true,
            message: "회원가입 성공",
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
/**
 *  @route Post user/emailcheck
 *  @desc email duplicate check
 *  @access Public
 */
router.post("/emailcheck", [express_validator_1.check("email", "Please include a valid email").isEmail()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userdata = yield Userdata_1.default.find({ email: req.body.email }).count();
        if (userdata == 0) {
            console.log("이메일 중복 체크 - 사용 가능한 이메일");
            return res.json({
                status: 200,
                success: true,
                message: "사용 가능한 이메일 입니다.",
                data: {
                    duplicate: "available",
                },
            });
        }
        console.log("이메일 중복 체크 - 사용중인 이메일");
        return res.status(400).json({
            status: 200,
            success: true,
            message: "이미 사용중인 이메일입니다.",
            data: {
                duplicate: "unavailable",
            },
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
module.exports = router;
//# sourceMappingURL=user.js.map