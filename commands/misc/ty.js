const constants = require("@utils/constants");
const comp = require("@utils/compliments");
module.exports = {
  commands: "ty",
  minArgs: 0,
  maxArgs: 1,
  cooldown: "15s",
  description: "KelleeBot gives you or another user a random compliment.",
  callback: (msg, args) => {
    var index = constants.getRandomNumber(comp.COMPLIMENTS.length);
    if (!args.length) {
      msg.channel.send(
        comp.COMPLIMENTS[index].replace("<user>", msg.author.username)
      );
    } else {
      var user = args[0].startsWith("@")
        ? args[0].replace("@", "").trim()
        : args[0].trim();
      msg.channel.send(comp.COMPLIMENTS[index].replace("<user>", user));
    }
  },
};
