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
  callback: (msg, args) => {
    const emoji = args[0];
    if (!emoji) {
      return msg.channel.send(`No emoji provided!`);
    }

    let custom = Discord.Util.parseEmoji(emoji);
    if (custom.id) {
      return msg.channel.send(
        `https://cdn.discordapp.com/emojis/${custom.id}.${
          custom.animated ? "gif" : "png"
        }`
      );
    } else {
      let parsed = parse(emoji, { assetType: "png" });
      if (!parsed[0]) {
        return msg.channel.send(`Invalid emoji!`);
      }

      return msg.channel.send(`${parsed[0].url}`);
    }
  },
};
