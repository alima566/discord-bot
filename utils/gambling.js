const mongo = require("@utils/mongo");
const gamblingSchema = require("@schemas/gambling-schema");
const pointsCache = {};

module.exports = (client) => {};

module.exports.addPoints = async (guildID, userID, points) => {
  return await mongo().then(async (mongoose) => {
    try {
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
    } finally {
      mongoose.connection.close();
    }
  });
};

module.exports.getPoints = async (guildID, userID) => {
  const cachedValue = pointsCache[`${guildID}-${userID}`];
  if (cachedValue) {
    return cachedValue;
  }
  return await mongo().then(async (mongoose) => {
    try {
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
    } finally {
      mongoose.connection.close();
    }
  });
};
