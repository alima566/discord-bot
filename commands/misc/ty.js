const { getRandomNumber } = require("@utils/functions");
const { COMPLIMENTS } = require("@utils/compliments");

module.exports = {
  category: "💡 Misc",
  minArgs: 0,
  expectedArgs: "[The other member to compliment]",
  cooldown: "15s",
  description: "KelleeBot gives you or another user a random compliment.",
  callback: ({ message, args, text }) => {
    const index = getRandomNumber(COMPLIMENTS);
    if (!args.length) {
      return message.channel.send(
        COMPLIMENTS[index].replace("<user>", message.author.username)
      );
    }

    let user = message.mentions.members.first()
      ? message.mentions.members.first().user.username
      : text.trim();

    message.channel.send(COMPLIMENTS[index].replace("<user>", user));
  },
};
