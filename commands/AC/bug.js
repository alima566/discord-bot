const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");
const constants = require("@utils/constants");
module.exports = {
  commands: "bug",
  expectedArgs: "<bug_name>",
  minArgs: 1,
  maxArgs: 1,
  description:
    "Retrieve information about a specific bug in *Animal Crossing: New Horizons*.",
  cooldown: 15,
  callback: (msg, args) => {
    fetch(`https://api.nookipedia.com/nh/bugs/${args[0].toLowerCase()}`, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.NOOK_API_KEY,
        "Accept-Version": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let msgEmbed = new MessageEmbed()
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
        msg.channel.send(`I couldn't find that bug :sob:`);
        console.log(err);
      });
  },
};
