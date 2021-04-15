const dreamAddressSchema = require("@schemas/dream-address-schema");
const dreamAddressCache = {};

module.exports.setDA = async (guildID, dreamAddress) => {
  try {
    const result = await dreamAddressSchema.findOneAndUpdate(
      { _id: guildID },
      { $set: { id: guildID, dreamAddress } },
      { upsert: true, new: true }
    );

    dreamAddressCache[guildID] = { dreamAddress: result.dreamAddress };
    return result;
  } catch (e) {
    console.log(e);
  }
};

module.exports.getDA = async (guildID) => {
  const cachedValue = dreamAddressCache[guildID];
  if (cachedValue) {
    console.log("Fetching from cache");
    return cachedValue;
  }

  try {
    console.log("Fetching from DB");
    const result = await dreamAddressSchema.findOne({
      _id: guildID,
    });

    if (result) {
      const { dreamAddress } = result;
      dreamAddressCache[guildID] = { dreamAddress };
      return result;
    }
  } catch (e) {
    console.log(e);
  }
};
