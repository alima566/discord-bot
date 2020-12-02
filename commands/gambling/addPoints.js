const gambling = require("@utils/gambling");
const numeral = require("numeral");
module.exports = {
  commands: ["add", "addpoints", "addbal"],
  category: "Gambling",
  minArgs: 2,
  maxArgs: 2,
  description: "Adds points to the specified user",
  expectedArgs: "<The target's @> <The number of points to add>",
  permissionError: "You must be an admininstrator to execute this command.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: async (msg, args) => {
    let mention =
      args[0].toLowerCase() === "all" ? "all" : msg.mentions.users.first();

    if (!mention) {
      msg.channel.send(`Please tag a user to add points to.`);
      return;
    }

    const points = args[1];
    if (isNaN(points)) {
      msg.channel.send(`Please provide a valid number of points.`);
      return;
    } else if (points <= 0) {
      msg.channel.send(`Please enter a number greater than 0.`);
      return;
    }

    const guildID = msg.guild.id;
    const userID = mention.id;

    if (mention === "all") {
      msg.guild.members.cache.forEach(async (mem) => {
        await gambling.addPoints(guildID, mem.user.id, points);
      });
      msg.channel.send(
        `You have given ${msg.guild.memberCount} users ${numeral(points).format(
          ","
        )} ${points !== 1 ? "points" : "point"}.`
      );
      return;
    }

    const newPoints = await gambling.addPoints(guildID, userID, points);
    msg.channel.send(
      `You have given <@${userID}> ${numeral(points).format(",")} ${
        points !== 1 ? "points" : "point"
      }. They now have ${numeral(newPoints).format(",")} ${
        points !== 1 ? "points" : "point"
      }.`
    );
  },
};
