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
      const { userID, points } = await fetchWinner(guildId);
      const month = moment().format("MMMM");
      channel.send(
        `Congrats to <@${userID}> for having the most points (${numeral(
          points
        ).format(
          "0,0"
        )}) for the month of ${month}! You have won a free month of Discord Nitro. Please check your DM for your gift!`
      );
      sendDM(client, userID, month, points);
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

const sendDM = (client, userID, month, points) => {
  const text = `Congratulations! You have the most points for the month of ${month} with ${numeral(
    points
  ).format(
    "0,0"
  )} points and have won a free month of Discord Nitro!\n\nTo claim it, please click on this link: ${
    process.env.DISCORD_NITRO_GIFT_LINK
  }. Please contact <@464635440801251328> if you encounter any problems.\n\nEnjoy the Nitro!`;
  client.users.cache
    .get(userID)
    .send(text)
    .then(() => {
      console.log(`Message succesfully sent to ${userID}`);
    })
    .catch((err) => {
      console.log(err);
    });
};
