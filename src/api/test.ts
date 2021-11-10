const express = require("express");
const router = express.Router();
const kakaoService = require("../services/kakaoService");

router.post("/kakao", async (req, res) => {
  console.log("... kakao testing ...");

  const { kakaoToken } = req.body;

  const tokenInfo = await kakaoService.checkToken(kakaoToken);
  console.log(tokenInfo);
  const userInfo = await kakaoService.getUserInfo(kakaoToken);

  // TODO Redirect Frot Server (쿠키, 세션, local_store 중에 로그인을 유지한다.)
  // TODO Data Base or 쿠키 refresh Token 저장 방법 모색
  res.send(userInfo);
});

module.exports = router;
