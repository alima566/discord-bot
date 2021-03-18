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
  category: "⚔️ Genshin",
  expectedArgs: "<Recipe>",
  minArgs: 1,
  description:
    "Retrieve information about a specific recipe in Genshin Impact.",
  cooldown: "15s",
  callback: ({ message, text }) => {
    const recipe = genshin.recipes(text);
    if (!recipe) {
      return message.reply(`I could not find a recipe by that name.`);
    }

    if (recipe.length) {
      return message.reply(
        `"${text}" returned more than one result. Please be more specific.`
      );
    }

    const {
      name,
      rarity,
      foodrecipetype,
      description,
      effect,
      buffs,
      images,
      ingredients,
      source,
    } = recipe;

    const embed = new MessageEmbed()
      .setColor("#355272")
      .setAuthor(name, images.image)
      .setThumbnail(images.image)
      .setDescription(description)
      .addFields(
        {
          name: "**Rarity**",
          value: stars[rarity],
          inline: true,
        },
        {
          name: "**Food Recipe Type**",
          value: foodrecipetype,
          inline: true,
        },
        {
          name: "**Buffs**",
          value: buffs.join(", "),
          inline: true,
        },
        {
          name: "**Effect**",
          value: effect,
          inline: false,
        },
        {
          name: "**Source**",
          value: source,
          inline: false,
        },
        {
          name: "**Ingredients**",
          value: ingredients.join("\n"),
          inline: false,
        }
      );
    message.channel.send(embed);
  },
};
