import Activity from "../models/Activity";
import Character from "../models/Character";

// 월 전체 게시글 가져오기
const getActivitiesOfMonth = async (user_id, activityYear, activityMonth) => {
  const activitiesOfMonth = await Activity.find({
    user_id,
    activityYear,
    activityMonth,
  })
    .select({
      user_id: 0,
      _id: 0,
      activityImage: 0,
      activityContent: 0,
      activityImageName: 0,
    })
    .sort({ activityDay: 1 });

  if (!activitiesOfMonth) {
    return null;
  }
  return activitiesOfMonth;
};

// 일별 베스트 캐릭터
const getDailyBestCharacter = async (user_id, activityYear, activityMonth) => {
  var characterIndexArr = [];

  const activities = await Activity.aggregate([
    {
      $match: {
        user_id: user_id,
        activityYear: activityYear,
        activityMonth: activityMonth,
      },
    },
    {
      $group: {
        _id: {
          activityYear: activityYear,
          activityMonth: activityMonth,
          activityDay: "$activityDay",
        },
        characterIndexArray: { $push: "$characterIndex" },
      },
    },
  ]).sort({ "_id.activityDay": 1 });

  for (var i = 0; i < activities.length; i++) {
    const countsDay = activities[i]["characterIndexArray"].reduce((pv, cv) => {
      pv[cv] = (pv[cv] || 0) + 1;
      return pv;
    }, {});
    const keys = Object.keys(countsDay);
    let mode = keys[0];
    keys.forEach((val, idx) => {
      if (countsDay[val] > countsDay[mode]) {
        mode = val;
      }
    });
    characterIndexArr.push(Number(mode));
  }

  if (!characterIndexArr) {
    return null;
  }
  return characterIndexArr;
};

// 월 베스트 캐릭터
const getMonthlyBestCharacter = async (
  user_id,
  activityYear,
  activityMonth
) => {
  const character = await Activity.aggregate([
    { $match: { user_id: user_id } },
    {
      $group: {
        _id: {
          user_id: user_id,
          activityYear: activityYear,
          activityMonth: activityMonth,
        },
        characterIndexArray: { $push: "$characterIndex" },
      },
    },
  ]);

  const countsMonth = character[0]["characterIndexArray"].reduce((pv, cv) => {
    pv[cv] = (pv[cv] || 0) + 1;
    return pv;
  }, {});

  const keys = Object.keys(countsMonth);
  let modeM = keys[0];
  keys.forEach((val, idx) => {
    if (countsMonth[val] > countsMonth[modeM]) {
      modeM = val;
    }
  });

  if (!character) {
    return null;
  }
  return modeM;
};

// 월 베스트 캐릭터 정보
const getMonthlyBestCharacterInfo = async (user_id, monthlyCharacterIndex) => {
  const characterInfo = await Character.findOne(
    { user_id, characterIndex: Number(monthlyCharacterIndex) },
    { _id: false, activity: false }
  ).select({ user_id: 0, _id: 0 });

  if (!characterInfo) {
    return null;
  }
  return characterInfo;
};

// 캐릭터마다의 레벨
const getCharactersLevel = async (user_id) => {
  var characterInfoArr = [];

  const charactersLevel = await Character.find(
    { user_id },
    {
      _id: false,
      characterName: true,
      characterLevel: true,
      characterImageIndex: true,
    }
  );

  for (var j = 0; j < charactersLevel.length; j++) {
    characterInfoArr.push(charactersLevel[j]);
  }

  if (!characterInfoArr) {
    return null;
  }
  return characterInfoArr;
};

module.exports = {
  getActivitiesOfMonth,
  getDailyBestCharacter,
  getMonthlyBestCharacter,
  getMonthlyBestCharacterInfo,
  getCharactersLevel,
};
