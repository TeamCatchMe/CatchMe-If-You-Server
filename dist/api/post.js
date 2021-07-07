"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = __importDefault(require("../utils/s3"));
const express = require('express');
const router = express.Router();
router.post('/', s3_1.default.single("image"), function (req, res, next) {
    try {
        console.log(req.file);
        res.json({
            "status": 200,
            "success": true,
            "message": " 용켸.성공.하셧웁니댜 ^00^ ??",
            "data": {
                "text": req.body.text,
                "image": req.file.location,
                "contentType": req.file.contentType,
            }
        });
    }
    catch (err) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    }
});
module.exports = router;
//# sourceMappingURL=post.js.map