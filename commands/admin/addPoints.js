const gambling = require("@utils/gambling");
const numeral = require("numeral");
module.exports = {
  commands: ["add", "addpoints", "addbal"],
  category: "Admin",
  minArgs: 2,
  maxArgs: 2,
  description: "Adds points to the specified user",
  expectedArgs: "<The target's @> <The number of points to add>",
  permissionError: "You must be an admininstrator to execute this command.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: async ({ message, args }) => {
    let mention =
      args[0].toLowerCase() === "all" ? "all" : message.mentions.users.first();

    if (!mention) {
      return message.channel.send(`Please tag a user to add points to.`);
    }

    const points = args[1];
    if (isNaN(points)) {
      return message.channel.send(`Please provide a valid number of points.`);
    } else if (points <= 0) {
      return message.channel.send(`Please enter a number greater than 0.`);
    }

    const guildID = message.guild.id;
    const userID = mention.id;

    if (mention.bot) {
      return message.channel.send(`You can not give points to bots!`);
    }

    if (mention === "all") {
      message.guild.members.cache.forEach(async (mem) => {
        if (!mem.user.bot) {
          await gambling.addPoints(guildID, mem.user.id, parseInt(points));
        }
      });

      const memberCount = message.guild.members.cache.filter(
        (mem) => !mem.user.bot
      ).size;
      message.channel.send(
        `You have given ${memberCount} member${
          memberCount !== 1 ? "s" : ""
        } ${numeral(parseInt(points)).format(",")} point${
          parseInt(points) !== 1 ? "s" : ""
        }.`
      );
      return;
    }

    const newPoints = await gambling.addPoints(
      guildID,
      userID,
      parseInt(points)
    );
    message.channel.send(
      `You have given <@${userID}> ${numeral(parseInt(points)).format(",")} ${
        parseInt(points) !== 1 ? "points" : "point"
      }. They now have ${numeral(newPoints).format(",")} ${
        newPoints !== 1 ? "points" : "point"
      }.`
    );
  },
};
