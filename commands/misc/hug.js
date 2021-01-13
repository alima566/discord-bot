const { getRandomNumber } = require("@utils/functions");

const aaronHug = [
  "Aaron runs away because <username> just tried to hug him! No hugging Aaron allowed!",
  "Aaron requests that <username> stay at least 6 feet away from him during these times. Hug rejected.",
  "Did you really just try to hug Aaron? You wanna get banned?",
  "Aaron is social distancing and does not want <username> invading his bubble. Please do not try to hug him again.",
];

module.exports = {
  commands: "hug",
  category: "Misc",
  minArgs: 0,
  cooldown: "15s",
  description: "Hugs another user.",
  callback: ({ message, args, text }) => {
    const { author } = message;
    if (!args.length) {
      return message.channel.send(
        `${author.username} hugs themselves because they didn't specify who to hug.`
      );
    }
    let user = args[0].startsWith("@")
      ? args[0].replace("@", "").trim()
      : text.trim();

    let userID = hasNumber(user) ? user.match(/\d+/)[0] : "";
    let emote = message.guild.emojis.cache.find((e) => e.name === "kellee1Hug");

    if (
      author.id === userID ||
      author.username.toLowerCase() === user.toLowerCase() ||
      user.toLowerCase() === "me"
    ) {
      return message.channel.send(
        `${author.username} gives themselves a hug because they are lonely.`
      );
    } else if (
      author.id === "423659646369267713" &&
      (user.toLowerCase() === "iaraaron" ||
        user.toLowerCase() === "iareaaron" ||
        user.toLowerCase() === "aaron" ||
        userID === "464635440801251328")
    ) {
      return message.channel.send(
        `${author.username} gives ${user} a great big hug. I love you ʕっ•ᴥ•ʔっ ${emote}`
      );
    } else if (
      user.toLowerCase() === "iaraaron" ||
      user.toLowerCase() === "iareaaron" ||
      user.toLowerCase() === "aaron" ||
      userID === "464635440801251328"
    ) {
      var index = getRandomNumber(aaronHug.length);
      var response = aaronHug[index].replace("<username>", author.username);
      return message.channel.send(response);
    } else {
      return message.channel.send(
        `${author.username} hugs ${user}. I love you ʕっ•ᴥ•ʔっ ${emote}`
      );
    }
  },
};

const hasNumber = (user) => {
  return /\d/.test(user);
};
