const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");
const {
  getMonthsAvailable,
  getTimesAvailable,
  log,
} = require("@utils/functions");

module.exports = {
  commands: "bug",
  category: "AC",
  expectedArgs: "<bug_name>",
  minArgs: 1,
  maxArgs: 1,
  description:
    "Retrieve information about a specific bug in *Animal Crossing: New Horizons*.",
  cooldown: "15s",
  callback: ({ message, args }) => {
    fetch(`https://api.nookipedia.com/nh/bugs/${args[0].toLowerCase()}`, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.NOOK_API_KEY,
        "Accept-Version": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const msgEmbed = new MessageEmbed()
          .setColor("NAVY")
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
              name: `**Flick Price**`,
              value: `${numeral(data.sell_flick).format("0,0")}`,
              inline: true,
            },
            /*{
              name: `**Rarity**`,
              value: `${data.rarity}`,
              inline: true
            },*/
            {
              name: `**Location**`,
              value: `${data.location}`,
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
        message.channel.send(`I couldn't find that bug :sob:`);
        log(
          "ERROR",
          "./commands/AC/bug.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};
