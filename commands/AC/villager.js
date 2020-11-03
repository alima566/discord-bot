const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
module.exports = {
  commands: "villager",
  expectedArgs: "<villager_name>",
  minArgs: 1,
  maxArgs: 1,
  description:
    "Retrieve information about a specific villager in any Animal Crossing game.",
  cooldown: 15,
  callback: (msg, args, text) => {
    fetch(
      `https://api.nookipedia.com/villagers?name=${args[0].toLowerCase()}&nhdetails=true`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": process.env.NOOK_API_KEY,
          "Accept-Version": "2.0.0",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let msgEmbed = new MessageEmbed()
          .setColor("ORANGE")
          .setURL(`${data[0].url}`)
          .setAuthor(
            `${data[0].name}`,
            data[0].nh_details === null
              ? `${data[0].image_url}`
              : `${data[0].nh_details.icon_url}`,
            `${data[0].url}`
          )
          .setDescription(
            `More info about ${data[0].name} can be found here:\n${data[0].url}`
          )
          .setThumbnail(`${data[0].image_url}`)
          .addFields(
            {
              name: `**Species**`,
              value: `${data[0].species}`,
              inline: true,
            },
            {
              name: `**Personality**`,
              value: `${data[0].personality}`,
              inline: true,
            },
            {
              name: `**Gender**`,
              value: `${data[0].gender}`,
              inline: true,
            },
            {
              name: `**Catchphrase**`,
              value: `${data[0].phrase}`,
              inline: true,
            },
            {
              name: `**Birthday**`,
              value:
                data[0].birthday_month === "" || data[0].birthday_day === ""
                  ? "-"
                  : `${data[0].birthday_month} ${moment
                      .localeData()
                      .ordinal(data[0].birthday_day)}`,
              inline: true,
            },
            {
              name: `**Sign**`,
              value: `${data[0].sign}`,
              inline: true,
            }
          );
        msg.channel.send(msgEmbed);
      })
      .catch((err) => {
        msg.channel.send(`I couldn't find that villager :sob:`);
        console.log(err);
      });
  },
};
