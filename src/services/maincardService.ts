import Character from "../models/Character";

const getCharacters = async (user_id) => {
  const characters = await Character.find({ user_id })
    .sort({ recentActivityTime: -1 })
    .select({ _id: 0, activity: 0 });

  if (!characters) {
    return null;
  }
  return characters;
};

const getCharactersMost = async (user_id) => {
  const characters = await Character.find({ user_id })
    .sort({ activityCount: -1 })
    .select({ _id: 0, activity: 0 });

  if (!characters) {
    return null;
  }
  return characters;
};

const getCharactersRecent = async (user_id) => {
  const characters = await Character.find({ user_id })
    .sort({ characterBirth: -1 })
    .select({ _id: 0, activity: 0 });

  if (!characters) {
    return null;
  }
  return characters;
};

module.exports = {
  getCharacters,
  getCharactersMost,
  getCharactersRecent,
};
