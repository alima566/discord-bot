const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");
const {
  getMonthsAvailable,
  getTimesAvailable,
  log,
} = require("@utils/functions");

module.exports = {
  commands: "sea",
  category: "AC",
  expectedArgs: "<seacreature_name>",
  minArgs: 1,
  maxArgs: 1,
  description:
    "Retrieve information about a specific sea creature in *Animal Crossing: New Horizons*.",
  cooldown: "15s",
  callback: ({ message, text }) => {
    text = text.trim();
    if (text.includes(" ")) {
      text = text.replace(/ +/g, "_");
    }
    fetch(`https://api.nookipedia.com/nh/sea/${text.toLowerCase()}`, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.NOOK_API_KEY,
        "Accept-Version": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const msgEmbed = new MessageEmbed()
          .setColor("AQUA")
          .setURL(`${data.url}`)
          .setAuthor(`${data.name}`, `${data.image_url}`, `${data.url}`)
          .setDescription(
            `More info about the ${data.name} can be found here:\n${data.url}`
          )
          .setThumbnail(`${data.image_url}`)
          .addFields(
            {
              name: `**Price**`,
              value: `${numeral(data.sell_nook).format("0,0")}`,
              inline: true,
            },
            {
              name: `**Shadow**`,
              value: `${data.shadow_size}`,
              inline: true,
            },
            /*{
              name: `**Rarity**`,
              value: `${data.rarity}`,
              inline: true
            },*/
            {
              name: `**Shadow Movement**`,
              value: `${data.shadow_movement}`,
              inline: true,
            },
            {
              name: `**Months Available**`,
              value: `North:\n${getMonthsAvailable(
                data.north
              )}\nSouth:\n${getMonthsAvailable(data.south)}`,
              inline: true,
            },
            {
              name: `**Time Available**`,
              value: `North:\n${getTimesAvailable(
                data.north
              )}\nSouth:\n${getTimesAvailable(data.south)}`,
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
        message.channel.send(`I couldn't find that sea creature :sob:`);
        log(
          "ERROR",
          "./commands/AC/sea.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};
