const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");
const constants = require("@utils/constants");
module.exports = {
  commands: "sea",
  expectedArgs: "<seacreature_name>",
  minArgs: 1,
  maxArgs: 1,
  description:
    "Retrieve information about a specific sea creature in *Animal Crossing: New Horizons*.",
  cooldown: 15,
  callback: (msg, args, text) => {
    fetch(`https://api.nookipedia.com/nh/sea/${args[0].toLowerCase()}`, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.NOOK_API_KEY,
        "Accept-Version": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let msgEmbed = new MessageEmbed()
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
              value: `North:\n${constants.getMonthsAvailable(
                data.availability_north
              )}\nSouth:\n${constants.getMonthsAvailable(
                data.availability_south
              )}`,
              inline: true,
            },
            {
              name: `**Time Available**`,
              value: `North:\n${constants.getTimesAvailable(
                data.availability_north
              )}\nSouth:\n${constants.getTimesAvailable(
                data.availability_south
              )}`,
              inline: true,
            }
          );
        msg.channel.send(msgEmbed);
      })
      .catch((err) => {
        msg.channel.send(`I couldn't find that sea creature :sob:`);
      });
  },
};
