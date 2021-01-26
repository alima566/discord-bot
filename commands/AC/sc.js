const { MessageEmbed } = require("discord.js");
const character = require("@root/acSpecialCharacters.json");

module.exports = {
  category: "AC",
  expectedArgs: "<character_name>",
  minArgs: 1,
  description:
    "Retrieve information about a special character from Animal Crossing.",
  cooldown: "15s",
  callback: ({ message, text }) => {
    if (text.includes(" ")) {
      text = text.replace(/ +/g, "_");
    }

    const name = character[0][text.toLowerCase()];
    if (name) {
      const msgEmbed = new MessageEmbed()
        .setColor("ORANGE")
        .setURL(name.url)
        .setAuthor(name.name, name.image_url, name.url)
        .setDescription(
          `More info about ${name.name} can be found here:\n${name.url}`
        )
        .setThumbnail(`${name.image_url}`)
        .addFields(
          {
            name: `**Species**`,
            value: `${name.species}`,
            inline: true,
          },
          {
            name: `**Gender**`,
            value: `${name.gender}`,
            inline: true,
          },
          {
            name: `**Birthday**`,
            value: name.birthday_month === "" ? "-" : `${name.birthday}`,
            inline: true,
          },
          {
            name: `**Sign**`,
            value: `${name.sign}`,
            inline: true,
          }
        )
        .setFooter(
          `Powered by Nookipedia`,
          `https://nookipedia.com/wikilogo.png`
        );
      return message.channel.send(msgEmbed);
    } else {
      return message.channel.send(
        "I couldn't find that specified character :sob:"
      );
    }
  },
};
