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
  slash: "both",
  commands: ["gi"],
  category: "⚔️ Genshin",
  expectedArgs: "<character>",
  minArgs: 1,
  description:
    "Retrieve information about a specific character in Genshin Impact.",
  cooldown: "15s",
  callback: ({ message, text }) => {
    const character = genshin.characters(text);
    if (!character) {
      const noChar = "I could not find a character by that name.";
      return message ? message.reply(noChar) : noChar;
    }

    if (character.length) {
      const multipleResults = `"${text}" returned more than one result. Please be more specific.`;
      return message ? message.reply(multipleResults) : multipleResults;
    }

    const {
      name,
      title,
      rarity,
      element,
      weapontype,
      region,
      gender,
      birthday,
      images,
      description,
      constellation,
      substat,
      url,
    } = character;

    const msgEmbed = new MessageEmbed()
      .setColor("#355272")
      .setAuthor(name, images.image, url.fandom)
      .setThumbnail(images.portrait)
      .setDescription(
        `${description}\n\nMore info about ${name} can be found here:\n${url}`
      )
      .addFields(
        {
          name: "**Title**",
          value: title,
          inline: true,
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
        },
        {
          name: "**Constellation**",
          value: constellation,
          inline: true,
        },
        {
          name: "**Substat**",
          value: substat,
          inline: true,
        }
      );
    return message ? message.channel.send(msgEmbed) : msgEmbed;
  },
};
