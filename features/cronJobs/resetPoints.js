const cron = require("cron");
const gamblingSchema = require("@schemas/gambling-schema");
const gambling = require("@utils/gambling");
const { log } = require("@utils/functions");
const { timezone } = require("@root/config.json");

module.exports = (client) => {
  new cron.CronJob(
    "05 00 00 1 * *",
    () => {
      execute(client);
    },
    null,
    true,
    timezone
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
      log(
        "SUCCESS",
        "./features/cronJobs/resetPoints.js",
        `Points have successfully been reset back to 0 for all ${results.length} members.`
      );
    }
  }
};

module.exports.config = {
  displayName: "Reset Points",
  dbName: "RESET_POINTS",
  loadDBFirst: true,
};
