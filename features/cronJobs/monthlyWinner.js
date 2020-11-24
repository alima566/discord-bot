const cron = require("cron");
const moment = require("moment");
const numeral = require("numeral");
const gamblingSchema = require("@schemas/gambling-schema");
module.exports = (client) => {
  const monthlyWinner = new cron.CronJob(
    "00 00 22 1 * *",
    () => {
      execute(client);
    },
    null,
    true,
    "America/Denver"
  );
};

const execute = async (client) => {
  const guildId = "707103910686621758";
  const channelId = "724484131643457650";

  const guild = client.guilds.cache.get(guildId);
  if (guild) {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
      const { guildID, userID, points } = await fetchWinner(guildId);
      const month = moment().format("MMMM");
      channel.send(
        `Congrats to <@${userID}> for having the most points (${numeral(
          points
        ).format(
          "0,0"
        )}) for the month of ${month}! You have won a free month of Discord Nitro.`
      );
      return;
    }
  }
};

const fetchWinner = async (guildID) => {
  const results = await gamblingSchema
    .find({
      guildID,
    })
    .sort({
      points: -1,
    })
    .limit(1);
  return results[0];
};
