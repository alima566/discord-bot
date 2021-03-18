const { MessageEmbed } = require("discord.js");
const { getGamblingChannel, getPoints } = require("@utils/gambling");
const gamblingSchema = require("@schemas/gambling-schema");

module.exports = {
  commands: ["points", "balance", "bal"],
  category: "🎰 Gambling",
  maxArgs: 1,
  description:
    "Displays how many points you or another user has and current ranking.",
  callback: async ({ message, client }) => {
    const target = message.mentions.users.first() || message.author;
    const channelID = message.channel.id;
    const guildID = message.guild.id;
    const userID = target.id;

    const gamblingChannel = await getGamblingChannel(guildID);

    if (gamblingChannel !== null) {
      if (channelID !== gamblingChannel) {
        message
          .reply(`Points can only be checked in <#${gamblingChannel}>!`)
          .then((msg) => {
            client.setTimeout(() => msg.delete(), 1000 * 3);
          });
        message.delete();
        return;
      }
    } else {
      return message.reply(
        `A gambling channel needs to be set first in order for this command to be used.`
      );
    }

    if (target.bot) {
      return message.reply(`You can't check bots points.`);
    }

    const points = await getPoints(guildID, userID);
    const ranking = await getRanking(guildID, userID);

    const msgEmbed = new MessageEmbed()
      .setColor("85bb65")
      .setAuthor(target.tag, target.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: `**Points**`,
          value: points.toLocaleString(),
          inline: true,
        },
        {
          name: `**Ranking**`,
          value: ranking,
          inline: true,
        }
      );

    message.channel.send(msgEmbed);
  },
};

const getRanking = async (guildID, userID) => {
  const results = await gamblingSchema.find({ guildID }).sort({ points: -1 });
  const rank = results.findIndex((i) => i.userID === userID);
  return `${rank + 1}/${results.length}`;
};
