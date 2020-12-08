const gambling = require("@utils/gambling");
const numeral = require("numeral");
const gamblingSchema = require("@schemas/gambling-schema");

module.exports = {
  commands: ["points", "balance", "bal"],
  category: "Gambling",
  maxArgs: 1,
  description: "Displays how many points you or another user has.",
  //cooldown: 15,
  requiredChannel: "gambling",
  callback: async (msg) => {
    const target = msg.mentions.users.first() || msg.author;
    const channelID = msg.channel.id;
    const guildID = msg.guild.id;
    const userID = target.id;

    const gamblingChannel = await gambling.getGamblingChannel(guildID);

    if (gamblingChannel !== null) {
      if (channelID !== gamblingChannel) {
        msg
          .reply(`Points can only be checked in <#${gamblingChannel}>!`)
          .then((message) => {
            message.delete({ timeout: 5000 });
          });
        msg.delete();
        return;
      }
    } else {
      msg.reply(
        `A gambling channel needs to be set first in order for this command to be used.`
      );
      return;
    }

    const points = await gambling.getPoints(guildID, userID);
    const ranking = await getRanking(guildID, userID);
    msg.channel.send(
      `${target} has ${numeral(points).format(",")} ${
        points !== 1 ? "points" : "point"
      } and ranks ${ranking}!`
    );
  },
};

const getRanking = async (guildID, userID) => {
  const results = await gamblingSchema.find({ guildID }).sort({ points: -1 });
  const rank = results.findIndex((i) => i.userID === userID);
  return `${rank + 1} out of ${results.length}`;
};
