const gambling = require("@utils/gambling");
const numeral = require("numeral");
module.exports = {
  commands: ["add", "addpoints", "addbal"],
  category: "Moderation",
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

    if (mention.bot) {
      msg.channel.send(`You can not give points to bots!`);
      return;
    }

    if (mention === "all") {
      msg.guild.members.cache.forEach(async (mem) => {
        if (!mem.user.bot) {
          await gambling.addPoints(guildID, mem.user.id, parseInt(points));
        }
      });

      const memberCount = msg.guild.members.cache.filter((mem) => !mem.user.bot)
        .size;
      msg.channel.send(
        `You have given ${memberCount} user${
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
    msg.channel.send(
      `You have given <@${userID}> ${numeral(parseInt(points)).format(",")} ${
        parseInt(points) !== 1 ? "points" : "point"
      }. They now have ${numeral(newPoints).format(",")} ${
        newPoints !== 1 ? "points" : "point"
      }.`
    );
  },
};
