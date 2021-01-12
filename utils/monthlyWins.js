const monthlyWinnersSchema = require("@schemas/monthly-winners-schema");

module.exports.incrementMonthlyWins = async (guildID, userID) => {
  await monthlyWinnersSchema.findOneAndUpdate(
    {
      guildID,
      userID,
    },
    {
      $inc: {
        monthlyWins: 1,
      },
    },
    {
      upsert: true,
    }
  );
};
