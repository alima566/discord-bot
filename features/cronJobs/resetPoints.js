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
  const guild = client.guilds.cache.get(guildId);
  if (guild) {
    const results = await gamblingSchema.find({
      guildID: guildId,
    });
    if (results) {
      for (const result of results) {
        const { guildID, userID } = result;
        const newPoints = await gambling.setPoints(guildID, userID, 0);
        console.log(userID, newPoints);
      }
      console.log(
        `Points have been reset back to 0 for all ${results.length} members.`
      );
    }
  }
};
