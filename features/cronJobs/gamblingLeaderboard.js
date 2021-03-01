const { MessageEmbed } = require("discord.js");
const gamblingLeaderboardSchema = require("@schemas/gambling-leaderboard-schema");
const gamblingSchema = require("@schemas/gambling-schema");
const { monthlyPrize } = require("@root/config.json");
const cron = require("cron");
const moment = require("moment-timezone");

module.exports = async (client) => {
  const updateLeaderboard = new cron.CronJob(
    "00 */5 * * * *",
    () => {
      execute(client);
    },
    null,
    true,
    "America/Denver"
  );
};

const fetchTopMembers = async (guildID) => {
  const timezone = moment.tz("America/New_York").format("z");
  const nextMonth = moment()
    .tz("America/New_York")
    .add(1, "months")
    .format("MMMM");
  let text = `Person with the most points at the end of each month gets a free month of *${monthlyPrize}*. A winner is determined at 12AM ${timezone} on the first of every month.\n\n`;
  const results = await gamblingSchema
    .find({
      guildID,
    })
    .sort({
      points: -1,
    })
    .limit(10);
  for (let count = 0; count < results.length; count++) {
    const { userID, points = 0 } = results[count];
    text += `${count + 1}. <@${userID}> has ${points.toLocaleString()} ${
      points !== 1 ? "points" : "point"
    }.\n`;
  }
  text += `\nPoints will be reset back to 0 at 12AM ${timezone} on ${nextMonth} 1st.`;
  return text;
};

const execute = async (client) => {
  const msgEmbed = new MessageEmbed()
    .setColor("#85bb65")
    .setTitle(`Gambling Leaderboard`)
    .setThumbnail(
      `https://i.imgur.com/VwbWTOn.png` //`https://cdn.glitch.com/2d031706-b85e-4c2b-8903-3af7e09dd1c4%2F310e3061-4bbb-400e-bb4e-59c6a4084a66_poker-chip.png?v=1604426732959`
    )
    .setTimestamp()
    .setFooter(`Leaderboard last updated `);

  const results = await gamblingLeaderboardSchema.find({});
  for (const result of results) {
    const { channelID, _id: guildID } = result;
    const guild = client.guilds.cache.get(guildID);
    if (guild) {
      const channel = client.channels.cache.get(channelID);
      if (channel) {
        const messages = await channel.messages.fetch();
        const firstMessage = messages.first();
        const topMembers = await fetchTopMembers(guildID);
        msgEmbed.setDescription(topMembers);
        if (firstMessage) {
          firstMessage.edit({ embed: msgEmbed });
        } else {
          await channel.send({ embed: msgEmbed });
        }
      }
    }
  }
};

module.exports.config = {
  displayName: "Leaderboard",
  dbName: "LEADERBOARD",
  loadDBFirst: true,
};
