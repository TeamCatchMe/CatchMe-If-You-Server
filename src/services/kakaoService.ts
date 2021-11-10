const request = require("request");

const getUserInfo = async kakaoToken => {
  request.get(
    {
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${kakaoToken}`,
      },
    },
    async (err, response, body) => {
      console.log("=== getuser ===");
      console.log(body);
      return body;
    }
  );
};

const checkToken = async kakaoToken => {
  return await request.get(
    {
      url: "https://kapi.kakao.com/v1/user/access_token_info",
      headers: {
        Authorization: `Bearer ${kakaoToken}`,
      },
    },
    async (err, response, body) => {
      console.log("=== checkToken ===");
      console.log(body);
      return body;
    }
  );
};

module.exports = { getUserInfo, checkToken };
