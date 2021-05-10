const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  slash: "both",
  category: "🍀 AC",
  expectedArgs: "<villager_name>",
  minArgs: 1,
  description:
    "Retrieve information about a specific villager in any Animal Crossing game.",
  cooldown: "15s",
  callback: async ({ message, text }) => {
    text = text.trim();
    if (text.includes(" ")) {
      text = text.replace(/ +/g, "_");
    }

    if (text.toLowerCase() === "etoile") {
      text = "Étoile";
    }

    try {
      const resp = await fetch(
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
      );

      const data = await resp.json();
      const {
        title_color,
        url,
        name,
        nh_details,
        image_url,
        species,
        personality,
        gender,
        phrase,
        birthday_month,
        birthday_day,
        sign,
      } = data[0];

      const msgEmbed = new MessageEmbed()
        .setColor(title_color ? `#${title_color}` : "ORANGE")
        .setURL(url)
        .setAuthor(name, nh_details ? nh_details.icon_url : image_url, url)
        .setDescription(`More info about ${name} can be found here:\n${url}`)
        .setThumbnail(image_url)
        .addFields(
          { name: "**Species**", value: species, inline: true },
          { name: "**Personality**", value: personality, inline: true },
          { name: "**Gender**", value: gender, inline: true },
          { name: "**Catchphrase**", value: phrase, inline: true },
          {
            name: "**Birthday**",
            value:
              birthday_month === "" || birthday_day === ""
                ? "-"
                : `${birthday_month} ${birthday_day}${getOrdinal(
                    parseInt(birthday_day)
                  )}`,
            inline: true,
          },
          { name: "**Sign**", value: sign, inline: true }
        )
        .setFooter(
          `Powered by Nookipedia`,
          `https://nookipedia.com/wikilogo.png`
        );
      return message ? message.channel.send(msgEmbed) : msgEmbed;
    } catch (e) {
      const errorMsg = "I couldn't find that villager :sob:";
      log(
        "ERROR",
        "./commands/AC/villager.js",
        `An error has occurred: ${e.message}`
      );
      return message ? message.channel.send(errorMsg) : errorMsg;
    }
  },
};

const getOrdinal = (n) => {
  return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
};
