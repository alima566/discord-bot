const gamblingSchema = require("@schemas/gambling-schema");
const pointsCache = {};

module.exports.addPoints = async (guildID, userID, points) => {
  const result = await gamblingSchema.findOneAndUpdate(
    {
      guildID,
      userID,
    },
    {
      guildID,
      userID,
      $inc: {
        points,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
  pointsCache[`${guildID}-${userID}`] = result.points;
  return result.points;
};

module.exports.setPoints = async (guildID, userID, points) => {
  const result = await gamblingSchema.findOneAndUpdate(
    {
      guildID,
      userID,
    },
    {
      guildID,
      userID,
      $set: {
        points,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
  pointsCache[`${guildID}-${userID}`] = result.points;
  return result.points;
};

module.exports.getPoints = async (guildID, userID) => {
  const cachedValue = pointsCache[`${guildID}-${userID}`];
  if (cachedValue) {
    return cachedValue;
  }
  const result = await gamblingSchema.findOne({
    guildID,
    userID,
  });

  let points = 0;
  if (result) {
    points = result.points;
  } else {
    await new gamblingSchema({
      guildID,
      userID,
      points,
    }).save();
  }
  pointsCache[`${guildID}-${userID}`] = points;
  return points;
};
