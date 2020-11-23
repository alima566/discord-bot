const gambling = require("@utils/gambling");
const numeral = require("numeral");
module.exports = {
  commands: ["add", "addpoints", "addbal"],
  minArgs: 2,
  maxArgs: 2,
  description: "Adds points to the specified user",
  expectedArgs: "<The target's @> <The number of points to add>",
  permissionError: "You must be an admininstrator to execute this command.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: async (msg, args) => {
    const mention = msg.mentions.users.first();
    if (!mention) {
      msg.channel.send(`Please tag a user to add points to.`);
      return;
    }

    const points = args[1];
    if (isNaN(points)) {
      msg.channel.send(`Please provide a valid number of points.`);
      return;
    } else if (points < 0) {
      msg.channel.send(`Please enter in a postive number.`);
      return;
    }

    const guildID = msg.guild.id;
    const userID = mention.id;

    const newPoints = await gambling.addPoints(guildID, userID, points);
    msg.channel.send(
      `You have given <@${userID}> ${numeral(points).format(",")} ${
        points === 0 || points > 1 ? "points" : "point"
      }. They now have ${numeral(newPoints).format(",")} ${
        points === 0 || points > 1 ? "points" : "point"
      }.`
    );
  },
};
