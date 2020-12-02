const gambling = require("@utils/gambling");
const numeral = require("numeral");
module.exports = {
  commands: ["set", "setpoints"],
  category: "Moderation",
  minArgs: 2,
  maxArgs: 2,
  description: "Sets a specified amount of points to the specified user",
  expectedArgs: "<The target's @> <The number of points to set>",
  permissionError: "You must be an admininstrator to execute this command.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: async (msg, args) => {
    const mention = msg.mentions.users.first();

    if (!mention) {
      msg.channel.send(`Please tag a user to set points to.`);
      return;
    }

    const points = args[1];
    if (isNaN(points)) {
      msg.channel.send(`Please provide a valid number of points.`);
      return;
    } else if (points < 0) {
      msg.channel.send(`Please enter a positive number.`);
      return;
    }

    const guildID = msg.guild.id;
    const userID = mention.id;

    const newPoints = await gambling.setPoints(
      guildID,
      userID,
      parseInt(points)
    );

    msg.channel.send(
      `Points have been set to ${numeral(newPoints).format(
        "0,0"
      )} for <@${userID}>.`
    );
  },
};
