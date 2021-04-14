const friendCodeSchema = require("@schemas/friend-code-schema");
const friendCodeCache = {};

module.exports.setFC = async (guildID, friendCode) => {
  try {
    const result = await friendCodeSchema.findOneAndUpdate(
      { _id: guildID },
      { $set: { id: guildID, friendCode } },
      { upsert: true, new: true }
    );

    friendCodeCache[guildID] = { friendCode: result.friendCode };
    return result;
  } catch (e) {
    console.log(e);
  }
};

module.exports.getFC = async (guildID) => {
  const cachedValue = friendCodeCache[guildID];
  if (cachedValue) {
    console.log("Fetching from cache");
    return cachedValue;
  }

  try {
    console.log("Fetching from DB");
    const result = await friendCodeSchema.findOne({
      _id: guildID,
    });

    if (result) {
      const { friendCode } = result;
      friendCodeCache[guildID] = { friendCode };
      return result;
    }
  } catch (e) {
    console.log(e);
  }
};
