const gambling = require("@utils/gambling");
const numeral = require("numeral");
module.exports = {
  commands: ["points", "balance", "bal"],
  maxArgs: 1,
  description: "Displays how many points you or another user has.",
  cooldown: 15,
  requiredChannel: "gambling",
  callback: async (msg, args, text) => {
    const target = msg.mentions.users.first() || msg.author;
    const targetID = target.id;

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
