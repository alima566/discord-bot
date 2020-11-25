const gambling = require("@utils/gambling");
const numeral = require("numeral");
module.exports = {
  commands: ["points", "balance", "bal"],
  category: "Gambling",
  maxArgs: 1,
  description: "Displays how many points you or another user has.",
  //cooldown: 15,
  requiredChannel: "gambling",
  callback: async (msg) => {
    const gamblingChannelID = "770695220220264448";
    if (msg.channel.id !== `${gamblingChannelID}`) {
      msg
        .reply(`Points can only be checked in <#${gamblingChannelID}>!`)
        .then((message) => {
          message.delete({ timeout: 5000 });
        });
      msg.delete();
      return;
    }

    const target = msg.mentions.users.first() || msg.author;
    const guildID = msg.guild.id;
    const userID = target.id;

    const points = await gambling.getPoints(guildID, userID);
    msg.channel.send(
      `${target} has ${numeral(points).format(",")} ${
        points > 1 || points === 0 ? "points" : "point"
      }!`
    );
  },
};
