const cron = require("cron");
const gamblingSchema = require("@schemas/gambling-schema");
const gambling = require("@utils/gambling");

module.exports = (client) => {
  const resetPoints = new cron.CronJob(
    "05 00 00 1 * *",
    () => {
      execute(client);
    },
    null,
    true,
    "America/New_York"
  );
};

const execute = async (client) => {
  const guildId = "707103910686621758";
  resetAllPoints(guildId);
};

const resetAllPoints = async (guildId) => {
  const results = await gamblingSchema.find({
    guildID: guildId,
  });
  if (results) {
    for (const result of results) {
      const { guildID, userID } = result;
      const points = await gambling.getPoints(guildID, userID);
      const newPoints = await gambling.addPoints(guildID, userID, points * -1);

      console.log(userID, newPoints);
    }
    console.log(
      `Points have been reset back to 0 for all ${results.length} records.`
    );
  }
};
