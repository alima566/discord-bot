const Discord = require("discord.js");
const { parse } = require("twemoji-parser");

module.exports = {
  slash: "both",
  category: "💡 Misc",
  cooldown: "15s",
  minArgs: 1,
  maxArgs: 1,
  description: "Enlarges an emote.",
  expectedArgs: "<emoji>",
  callback: ({ message, args }) => {
    const emoji = args[0];
    if (message) {
      if (!emoji) {
        return message.channel.send(`No emoji provided!`);
      }
    }

    let custom = Discord.Util.parseEmoji(emoji);
    if (custom.id) {
      return message
        ? message.channel.send(
            `https://cdn.discordapp.com/emojis/${custom.id}.${
              custom.animated ? "gif" : "png"
            }`
          )
        : `https://cdn.discordapp.com/emojis/${custom.id}.${
            custom.animated ? "gif" : "png"
          }`;
    } else {
      let parsed = parse(emoji, { assetType: "png" });
      if (!parsed[0]) {
        return message
          ? message.channel.send(`Invalid emoji!`)
          : "Invalid emoji!";
      }

      return message ? message.channel.send(`${parsed[0].url}`) : parsed[0].url;
    }
  },
};
