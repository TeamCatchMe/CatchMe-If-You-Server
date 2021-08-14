const rm = require("../modules/responseMessage");
const sc = require("../modules/statusCode");
const logger = require("../modules/logger");
const moment = require("moment");
import createError from "http-errors";
import Character from "../models/Character";

// 캐릭터 조회
const getCharacter = async (user_id, characterIndex) => {
  const character = await Character.findOne({
    user_id,
    characterIndex: Number(characterIndex),
  }).select({ _id: 0, user_nickname: 0 });

  if (!character) {
    return null;
  }
  return character;
};

// 전체 활동 조회
const getAllActivities = async (user_id) => {
  const allActivities = await Character.find({
    user_id,
  }).sort({ activityYear: -1, activityMonth: -1 });

  if (!allActivities) {
    return null;
  }
  return allActivities;
};

// 마지막 캐릭터 조회
const getLastCharacter = async (user_id) => {
  const lastCharacter = await Character.find({ user_id })
    .sort({ _id: -1 })
    .select({ user_id: 0, _id: 0 });

  if (!lastCharacter) {
    return null;
  }
  return lastCharacter;
};

// 캐릭터 생성
const createCharacter = async (
  user_id,
  user_nickname,
  characterName,
  characterIndex,
  characterImageIndex,
  characterPrivacy,
  characterBirth
) => {
  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_MAINCARD_CREATE, "[", logTime, "]");

    const newCharacter = new Character({
      user_id: user_id,
      user_nickname: user_nickname["nickname"],
      characterName: characterName,
      characterIndex: characterIndex,
      characterImageIndex: characterImageIndex,
      characterPrivacy: characterPrivacy,
      characterLevel: 1,
      characterBirth: characterBirth,
      resentActivityTime: characterBirth,
      activityCount: 0,
    });

    await newCharacter.save();

    return newCharacter;
  } catch (error) {
    console.log(logger.FAIL_MAINCARD_CREATE, "[", logTime, "]");
    throw createError(rm.CHARACTER_CREATE_FAIL);
  }
};

// 캐릭터 존재하는지 체크
const isCharacterExist = async (user_id, characterIndex) => {
  const time = moment();
  var logTime = time.format("HH:mm:ss");
  console.log(logger.TRY_MAINCARD_CREATE, "[", logTime, "]");

  const checkIndex = await Character.find({
    user_id,
    characterIndex,
  }).countDocuments();

  if (checkIndex == 0) {
    throw createError(rm.NOT_FOUND_CHARACTER);
  }
};

// 캐릭터 수정
const editCharacter = async (
  user_id,
  characterIndex,
  characterName,
  characterPrivacy
) => {
  try {
    const time = moment();
    var logTime = time.format("HH:mm:ss");
    console.log(logger.TRY_MAINCARD_CREATE, "[", logTime, "]");

    await Character.findOneAndUpdate(
      {
        user_id: user_id,
        characterIndex: characterIndex,
      },
      {
        characterName: characterName,
        characterPrivacy: characterPrivacy,
      }
    );
  } catch (error) {
    console.log(logger.FAIL_CHARACTER_EDIT, "[", logTime, "]");
    throw createError(rm.CHARACTER_EDIT_FAIL);
  }
};

module.exports = {
  getCharacter,
  getAllActivities,
  getLastCharacter,
  createCharacter,
  isCharacterExist,
  editCharacter,
};
