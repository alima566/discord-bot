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
    let mention =
      args[0].toLowerCase() === "all" ? "all" : msg.mentions.users.first();

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

    if (mention.bot) {
      msg.channel.send(`You can not give points to bots!`);
      return;
    }

    if (mention === "all") {
      msg.guild.members.cache.forEach(async (mem) => {
        if (!mem.user.bot) {
          await gambling.setPoints(guildID, mem.user.id, parseInt(points));
        }
      });

      const memberCount = msg.guild.members.cache.filter((mem) => !mem.user.bot)
        .size;
      msg.channel.send(
        `You have set ${memberCount} user${
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

    msg.channel.send(
      `Points have been set to ${numeral(newPoints).format(
        "0,0"
      )} for <@${userID}>.`
    );
  },
};
