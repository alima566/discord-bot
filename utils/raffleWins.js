const raffleWinsSchema = require("@schemas/raffle-wins-schema");

module.exports.incrementRaffleWins = async (guildID, userID) => {
  await raffleWinsSchema.findOneAndUpdate(
    {
      guildID,
      userID,
    },
    {
      $inc: {
        raffleWins: 1,
      },
    },
    {
      upsert: true,
    }
  );
};
