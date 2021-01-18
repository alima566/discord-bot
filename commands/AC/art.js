const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");
const { log } = require("@utils/functions");

module.exports = {
  commands: "art",
  category: "AC",
  expectedArgs: "<artwork_name>",
  minArgs: 1,
  //maxArgs: 1,
  description:
    "Retrieve information about a specific artwork in *Animal Crossing: New Horizons*.",
  cooldown: "15s",
  callback: ({ message, text }) => {
    if (text.includes(" ")) {
      text = text.replace(" ", "_");
    }
    fetch(`https://api.nookipedia.com/nh/art/${text.toLowerCase()}`, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.NOOK_API_KEY,
        "Accept-Version": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.title === "No data was found for the given query.") {
          return message.reply(`I couldn't find that artwork :sob:`);
        }

        const msgEmbed = new MessageEmbed()
          .setColor("DARK_RED")
          .setURL(`${data.url}`)
          .setAuthor(`${data.name}`, `${data.image_url}`, `${data.url}`)
          .setDescription(
            `More info about the ${data.name} can be found here:\n${data.url}`
          )
          .setThumbnail(`${data.image_url}`)
          .addFields(
            {
              name: `**Buy Price**`,
              value: `${numeral(data.buy).format("0,0")}`,
              inline: true,
            },
            {
              name: `**Sell Price**`,
              value: `${numeral(data.sell).format("0,0")}`,
              inline: true,
            },
            {
              name: `**Has Fake**`,
              value: data.has_fake ? "Yes" : "No",
              inline: true,
            },
            {
              name: `**Authenticity**`,
              value: !data.authenticity
                ? `This artwork is always genuine.`
                : data.authenticity,
              inline: true,
            }
          )
          .setFooter(
            `Powered by Nookipedia`,
            `https://nookipedia.com/wikilogo.png`
          );
        message.channel.send(msgEmbed);
      })
      .catch((e) => {
        message.channel.send(`I couldn't find that artwork :sob:`);
        log(
          "ERROR",
          "./commands/AC/art.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};
