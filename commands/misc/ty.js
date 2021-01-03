const { getRandomNumber } = require("@utils/functions");
const comp = require("@utils/compliments");
module.exports = {
  commands: "ty",
  category: "Misc",
  minArgs: 0,
  maxArgs: 1,
  cooldown: "15s",
  description: "KelleeBot gives you or another user a random compliment.",
  callback: ({ message, args }) => {
    var index = getRandomNumber(comp.COMPLIMENTS.length);
    if (!args.length) {
      message.channel.send(
        comp.COMPLIMENTS[index].replace("<user>", message.author.username)
      );
    } else {
      var user = args[0].startsWith("@")
        ? args[0].replace("@", "").trim()
        : args[0].trim();
      message.channel.send(comp.COMPLIMENTS[index].replace("<user>", user));
    }
  },
};
