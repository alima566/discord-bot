const genshin = require("genshin-db");
const { MessageEmbed } = require("discord.js");

const stars = {
  1: "⭐",
  2: "⭐⭐",
  3: "⭐⭐⭐",
  4: "⭐⭐⭐⭐",
  5: "⭐⭐⭐⭐⭐",
};

module.exports = {
  commands: ["character", "gi"],
  category: "Genshin",
  expectedArgs: "<character name>",
  minArgs: 1,
  description:
    "Retrieve information about a specific character in Genshin Impact.",
  cooldown: "15s",
  callback: ({ message, text }) => {
    const character = genshin.characters(text);
    if (!character) {
      return message.reply(`I could not find a character by that name.`);
    }

    if (character.length) {
      return message.reply(
        `"${text}" returned more than one result. Please be more specific.`
      );
    }

    const {
      name,
      titles,
      rarity,
      element,
      weapontype,
      region,
      gender,
      birthday,
      images,
      description,
      url,
    } = character;

    const embed = new MessageEmbed()
      .setColor("#355272")
      .setAuthor(name, images.image, url)
      .setThumbnail(images.portrait)
      .setDescription(
        `${description}\n\nMore info about ${name} can be found here:\n${url}`
      )
      .addFields(
        {
          name: "**Titles**",
          value: titles.join(", "),
          inline: false,
        },
        {
          name: "**Gender**",
          value: gender,
          inline: true,
        },
        {
          name: "**Birthday**",
          value: birthday,
          inline: true,
        },
        {
          name: "**Rarity**",
          value: stars[rarity],
          inline: true,
        },
        {
          name: "**Weapon**",
          value: weapontype,
          inline: true,
        },
        {
          name: "**Element**",
          value: element,
          inline: true,
        },
        {
          name: "**Region**",
          value: region,
          inline: true,
        }
      );
    message.channel.send(embed);
  },
};
