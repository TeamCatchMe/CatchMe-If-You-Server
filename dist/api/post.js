"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const s3_1 = __importDefault(require("../utils/s3"));
const express = require('express');
const router = express.Router();
router.post('/', s3_1.default.single("image"), function (req, res, next) {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            "status": 400,
            "success": false,
            "message": "다시 하세요. 아쉽습니다.",
            "data": null
        });
    }
    res.json({
        "status": 200,
        "success": true,
        "message": " 용켸.성공.하셧웁니댜 ^00^ ??",
        "data": {
            "text": req.body.text,
            "image": req.file.location
        }
    });
});
module.exports = router;
//# sourceMappingURL=post.js.map