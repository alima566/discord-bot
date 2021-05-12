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
  category: "⚔️ Genshin",
  expectedArgs: "<food>",
  minArgs: 1,
  description:
    "Retrieve information about a specific recipe in Genshin Impact.",
  cooldown: "15s",
  callback: ({ message, text }) => {
    const recipe = genshin.foods(text);
    if (!recipe) {
      const noRecipe = "I could not find a recipe by that name.";
      return message ? message.reply(noRecipe) : noRecipe;
    }

    if (recipe.length) {
      const multipleResults = `"${text}" returned more than one result. Please be more specific.`;
      return message ? message.reply(multipleResults) : multipleResults;
    }

    const {
      name,
      rarity,
      foodtype,
      foodfilter,
      description,
      effect,
      images,
      ingredients,
      url,
    } = recipe;

    const msgEmbed = new MessageEmbed()
      .setColor("#355272")
      .setAuthor(name, images.image, url.fandom)
      .setThumbnail(images.image)
      .setDescription(`${description}\n[Read More](${url.fandom})`)
      .addFields(
        {
          name: "**Rarity**",
          value: stars[rarity],
          inline: true,
        },
        {
          name: "**Food Recipe Type**",
          value: toProperCase(foodtype),
          inline: true,
        },
        {
          name: "**Food Filter**",
          value: foodfilter,
          inline: true,
        },
        {
          name: "**Effect**",
          value: effect,
          inline: false,
        },
        {
          name: "**Ingredients**",
          value: getIngredients(ingredients),
          inline: false,
        }
      );
    return message ? message.channel.send(msgEmbed) : msgEmbed;
  },
};

const getIngredients = (data) => {
  let ingredients = "";
  data.forEach((i) => {
    ingredients += `${i.count}x ${i.name}\n`;
  });
  return ingredients;
};

const toProperCase = (string) => {
  return string.charAt(0) + string.slice(1).toLowerCase();
};
