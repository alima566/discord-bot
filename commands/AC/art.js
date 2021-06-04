const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");
const { log } = require("@utils/functions");

const errorMsg = "I couldn't find that artwork :sob:";

module.exports = {
  slash: "both",
  category: "🍀 AC",
  expectedArgs: "<artwork_name>",
  minArgs: 1,
  description:
    "Retrieve information about a specific artwork in *Animal Crossing: New Horizons*.",
  cooldown: "15s",
  callback: async ({ message, text }) => {
    text = text.trim();
    if (text.includes(" ")) {
      text = text.replace(/ +/g, "_");
    }

    try {
      const resp = await fetch(
        `https://api.nookipedia.com/nh/art/${text.toLowerCase()}`,
        {
          method: "GET",
          headers: {
            "X-API-KEY": process.env.NOOK_API_KEY,
            "Accept-Version": "2.0.0",
          },
        }
      );
      const data = await resp.json();
      const { title, url, name, image_url, buy, sell, has_fake, authenticity } = data;

      if (title === "No data was found for the given query.") {
        return message ? message.channel.send(errorMsg) : errorMsg;
      }

      const msgEmbed = new MessageEmbed()
        .setColor("RED")
        .setURL(url)
        .setAuthor(name, image_url, url)
        .setDescription(
          `More info about the ${name} can be found here:\n${url}`
        )
        .setThumbnail(image_url)
        .addFields(
          {
            name: "**Buy Price**",
            value: numeral(buy).format("0,0"),
            inline: true,
          },
          {
            name: "**Sell Price**",
            value: numeral(sell).format("0,0"),
            inline: true,
          },
          {
            name: "**Has Fake**",
            value: has_fake ? "Yes" : "No",
            inline: true,
          },
          {
            name: "**Authenticity**",
            value: authenticity
              ? authenticity
              : "This artwork is always genuine.",
            inline: true,
          }
        )
        .setFooter(
          `Powered by Nookipedia`,
          `https://nookipedia.com/wikilogo.png`
        );
      return message ? message.channel.send(msgEmbed) : msgEmbed;
    } catch (e) {
      log(
        "ERROR",
        "./commands/AC/art.js",
        `An error has occurred: ${e.message}`
      );
      return message ? message.channel.send(errorMsg) : errorMsg;
    }
  },
};
