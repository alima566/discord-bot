const constants = require("@utils/constants");
module.exports = {
  commands: "hug",
  minArgs: 0,
  maxArgs: 1,
  cooldown: 15,
  description: "Hugs another user.",
  callback: (msg, args, text) => {
    const { author } = msg;
    if (!args.length) {
      msg.channel.send(
        `${author.username} hugs themselves because they didn't specify who to hug.`
      );
    } else {
      let user = args[0].startsWith("@")
        ? args[0].replace("@", "").trim()
        : args[0].trim();

      let userID = hasNumber(user) ? user.match(/\d+/)[0] : "";
      let emote = msg.guild.emojis.cache.find((e) => e.name === "kellee1Hug");

      if (
        author.id === userID ||
        author.username.toLowerCase() === user.toLowerCase() ||
        user.toLowerCase() === "me"
      ) {
        msg.channel.send(
          `${author.username} gives themselves a hug because they are lonely.`
        );
        return;
      } else if (
        author.id === "423659646369267713" &&
        (user.toLowerCase() === "iaraaron" ||
          user.toLowerCase() === "iareaaron" ||
          user.toLowerCase() === "aaron" ||
          userID === "464635440801251328")
      ) {
        msg.channel.send(
          `${author.username} gives ${user} a great big hug. I love you ʕっ•ᴥ•ʔっ ${emote}`
        );
        return;
      } else if (
        user.toLowerCase() === "iaraaron" ||
        user.toLowerCase() === "iareaaron" ||
        user.toLowerCase() === "aaron" ||
        userID === "464635440801251328"
      ) {
        var index = constants.getRandomIntInclusive(
          0,
          constants.BOT_COMMAND_RESPONSES["aaronHug"].length - 1
        );
        var response = constants.BOT_COMMAND_RESPONSES["aaronHug"][
          index
        ].replace("<username>", author.username);
        msg.channel.send(response);
        return;
      } else {
        msg.channel.send(
          `${author.username} hugs ${user}. I love you ʕっ•ᴥ•ʔっ ${emote}`
        );
        return;
      }
    }
  },
};

function hasNumber(user) {
  return /\d/.test(user);
}
