const uidSchema = require("@schemas/uid-schema");
const uidCache = {};

module.exports.setUID = async (guildID, uid) => {
  try {
    const result = await uidSchema.findOneAndUpdate(
      { _id: guildID },
      { $set: { id: guildID, uid } },
      { upsert: true, new: true }
    );

    uidCache[guildID] = { uid: result.uid };
    return result;
  } catch (e) {
    console.log(e);
  }
};

module.exports.getUID = async (guildID) => {
  const cachedValue = uidCache[guildID];
  if (cachedValue) {
    console.log("Fetching from cache");
    return cachedValue;
  }

  try {
    console.log("Fetching from DB");
    const result = await uidSchema.findOne({
      _id: guildID,
    });

    if (result) {
      const { uid } = result;
      uidCache[guildID] = { uid };
      return result;
    }
  } catch (e) {
    console.log(e);
  }
};
