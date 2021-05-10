const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");
const {
  getMonthsAvailable,
  getTimesAvailable,
  log,
} = require("@utils/functions");

module.exports = {
  slash: "both",
  category: "🍀 AC",
  expectedArgs: "<bug_name>",
  minArgs: 1,
  description:
    "Retrieve information about a specific bug in *Animal Crossing: New Horizons*.",
  cooldown: "15s",
  callback: async ({ message, text }) => {
    text = text.trim();
    if (text.includes(" ")) {
      text = text.replace(/ +/g, "_");
    }

    try {
      const resp = await fetch(
        `https://api.nookipedia.com/nh/bugs/${text.toLowerCase()}`,
        {
          method: "GET",
          headers: {
            "X-API-KEY": process.env.NOOK_API_KEY,
            "Accept-Version": "2.0.0",
          },
        }
      );
      const data = await resp.json();
      const {
        url,
        name,
        image_url,
        sell_nook,
        sell_flick,
        location,
        north,
        south,
      } = data;

      const msgEmbed = new MessageEmbed()
        .setColor("NAVY")
        .setURL(url)
        .setAuthor(name, image_url, url)
        .setDescription(
          `More info about the ${name} can be found here:\n${url}`
        )
        .setThumbnail(image_url)
        .addFields(
          {
            name: "**Price**",
            value: numeral(sell_nook).format("0,0"),
            inline: true,
          },
          {
            name: "**Flick Price**",
            value: numeral(sell_flick).format("0,0"),
            inline: true,
          },
          {
            name: "**Location**",
            value: location,
            inline: true,
          },
          {
            name: "**Months Available**",
            value: `North:\n${getMonthsAvailable(
              north
            )}\nSouth:\n${getMonthsAvailable(south)}`,
            inline: true,
          },
          {
            name: "**Time Available**",
            value: `North:\n${getTimesAvailable(
              north
            )}\nSouth:\n${getTimesAvailable(south)}`,
            inline: true,
          }
        )
        .setFooter(
          `Powered by Nookipedia`,
          `https://nookipedia.com/wikilogo.png`
        );
      return message ? message.channel.send(msgEmbed) : msgEmbed;
    } catch (e) {
      const errorMsg = "I couldn't find that bug :sob:";
      log(
        "ERROR",
        "./commands/AC/bug.js",
        `An error has occurred: ${e.message}`
      );
      return message ? message.channel.send(errorMsg) : errorMsg;
    }
  },
};
