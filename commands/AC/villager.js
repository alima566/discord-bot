const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  category: "AC",
  expectedArgs: "<villager_name>",
  minArgs: 1,
  description:
    "Retrieve information about a specific villager in any Animal Crossing game.",
  cooldown: "15s",
  callback: ({ message, text }) => {
    text = text.trim();
    if (text.includes(" ")) {
      text = text.replace(/ +/g, "_");
    }
    fetch(
      `https://api.nookipedia.com/villagers?name=${encodeURIComponent(
        text.toLowerCase()
      )}&nhdetails=true`,
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
        console.log(data);
        const msgEmbed = new MessageEmbed()
          .setColor(data[0].title_color ? `#${data[0].title_color}` : "ORANGE")
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
                  : `${data[0].birthday_month} ${
                      data[0].birthday_day
                    }${getOrdinal(parseInt(data[0].birthday_day))}`,
              inline: true,
            },
            {
              name: `**Sign**`,
              value: `${data[0].sign}`,
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
        message.channel.send(`I couldn't find that villager :sob:`);
        log(
          "ERROR",
          "./commands/AC/villager.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};

const getOrdinal = (n) => {
  return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
};
