const cron = require("cron");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");
const gamblingSchema = require("@schemas/gambling-schema");
const { incrementMonthlyWins } = require("@utils/monthlyWins");
const { monthlyPrize } = require("@root/config.json");
const { sendMessageToBotThings, log } = require("@utils/functions");

module.exports = (client) => {
  const monthlyWinner = new cron.CronJob(
    "00 00 00 1 * *",
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
  const channelId = "724484131643457650";
  const masterGamblerRoleID = "795356217978388511";

  const guild = client.guilds.cache.get(guildId);
  if (guild) {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
      const { userID, points } = await fetchWinner(guildId);
      const month = moment()
        .tz("America/New_York")
        .subtract(1, "months")
        .format("MMMM");
      channel.send(
        `Congrats to <@${userID}> for having the most points (${points.toLocaleString()}) for the month of ${month}! You have won a free month of ${monthlyPrize} and have earned the coveted <@&${masterGamblerRoleID}> role! Please check your DM for your gift!`
      );
      sendDM(client, guild, userID, month, points);
      await incrementMonthlyWins(guildId, userID);
      addRemoveRole(masterGamblerRoleID, guild, userID);
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

const sendDM = (client, guild, userID, month, points) => {
  const embed = new MessageEmbed()
    .setColor("#7289da")
    .setTitle("Congratulations!")
    .setDescription(
      `Congratulations! You have the most points for the month of ${month} with ${points.toLocaleString()} points and have won a free month of Discord Nitro!
      
      To claim it, please click [here](${process.env.DISCORD_NITRO_GIFT_LINK}).

      Please contact <@464635440801251328> if you encounter any problems.

      Fun fact: With Discord Nitro, you have two free server boosts to any server you like.

      Enjoy the Nitro!`
    )
    .setThumbnail(
      "https://www.howtogeek.com/wp-content/uploads/2020/04/Discord-Nitro-Banner-Image.jpg"
    )
    .setFooter("Please do no reply to this DM as this is not monitored.")
    .setTimestamp();

  client.users.cache
    .get(userID)
    .send(embed)
    .then(() => {
      sendMessageToBotThings(
        client,
        guild,
        `Message succesfully sent to <@${userID}>`
      );
      log(
        "SUCCESS",
        "./features/cronJobs/monthlyWinner.js",
        `Message succesfully sent to ${userID}`
      );
    })
    .catch((e) => {
      log(
        "ERROR",
        "./features/cronJobs/monthlyWinner.js",
        `There was an error with sending DM to ${userID}: ${e.message}`
      );
    });
};

const addRemoveRole = (masterGamblerRole, guild, userID) => {
  const role = guild.roles.cache.get(masterGamblerRole);
  const currentMember = guild.members.cache.filter((member) =>
    member.roles.cache.find((r) => r == role)
  ); // Get current member with the Master Gambler role
  currentMember.first().roles.remove(role); // Remove the Master Gambler role from the previous month's winner

  const member = guild.members.cache.get(userID);
  member.roles.add(role); // Add the Master Gambler role to the new winner
};

module.exports.config = {
  displayName: "Monthly Winner",
  dbName: "MONTHLY_WINNER",
  loadDBFirst: true,
};
