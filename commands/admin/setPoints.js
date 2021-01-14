const gambling = require("@utils/gambling");
const numeral = require("numeral");
module.exports = {
  commands: ["set", "setpoints"],
  category: "Admin",
  minArgs: 2,
  maxArgs: 2,
  description: "Sets a specified amount of points to the specified user",
  expectedArgs: "<The target's @> <The number of points to set>",
  permissionError: "You must be an admininstrator to execute this command.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: async ({ message, args }) => {
    let mention =
      args[0].toLowerCase() === "all" ? "all" : message.mentions.users.first();

    if (!mention) {
      return message.channel.send(`Please tag a user to set points to.`);
    }

    const points = args[1];
    if (isNaN(points)) {
      return message.channel.send(`Please provide a valid number of points.`);
    } else if (points < 0) {
      return message.channel.send(`Please enter a positive number.`);
    }

    const guildID = message.guild.id;
    const userID = mention.id;

    if (mention.bot) {
      return message.channel.send(`You can not give points to bots!`);
    }

    if (mention === "all") {
      message.guild.members.cache.forEach(async (mem) => {
        if (!mem.user.bot) {
          await gambling.setPoints(guildID, mem.user.id, parseInt(points));
        }
      });

      const memberCount = message.guild.members.cache.filter(
        (mem) => !mem.user.bot
      ).size;
      message.channel.send(
        `You have set ${memberCount} member${
          memberCount !== 1 ? "s" : ""
        } points to ${numeral(parseInt(points)).format(",")}`
      );
      return;
    }

    const newPoints = await gambling.setPoints(
      guildID,
      userID,
      parseInt(points)
    );

    message.channel.send(
      `Points have been set to ${numeral(newPoints).format(
        "0,0"
      )} for <@${userID}>.`
    );
  },
};
