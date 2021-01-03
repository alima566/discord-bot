const Discord = require("discord.js");
const { parse } = require("twemoji-parser");

module.exports = {
  commands: "enlarge",
  category: "Misc",
  cooldown: "15s",
  minArgs: 1,
  maxArgs: 1,
  description: "Enlarges an emote.",
  expectedArgs: "<emoji>",
  callback: ({ message, args }) => {
    const emoji = args[0];
    if (!emoji) {
      return message.channel.send(`No emoji provided!`);
    }

    let custom = Discord.Util.parseEmoji(emoji);
    if (custom.id) {
      return message.channel.send(
        `https://cdn.discordapp.com/emojis/${custom.id}.${
          custom.animated ? "gif" : "png"
        }`
      );
    } else {
      let parsed = parse(emoji, { assetType: "png" });
      if (!parsed[0]) {
        return message.channel.send(`Invalid emoji!`);
      }

      return message.channel.send(`${parsed[0].url}`);
    }
  },
};
