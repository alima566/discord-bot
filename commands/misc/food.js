const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  commands: ["breakfast", "lunch", "dinner"],
  category: "💡 Misc",
  cooldown: "15s",
  description: "KelleeBot shows you a random meal.",
  callback: ({ message }) => {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((resp) => resp.json())
      .then((data) => {
        const { meals } = data;
        console.log(meals[0]);
        const msgEmbed = new MessageEmbed()
          .setColor(0x337fd5)
          .setTitle(meals[0].strMeal)
          .setURL(meals[0].strYoutube)
          .setThumbnail(meals[0].strMealThumb)
          .setDescription(
            `For information on how to cook this dish and what the ingredients are, please click [here](${meals[0].strSource}).\n\nYou can also check out this YouTube video: ${meals[0].strYoutube}.`
          )
          .setTimestamp()
          .addFields(
            {
              name: "**Category**",
              value: meals[0].strCategory,
              inline: true,
            },
            {
              name: "**Area**",
              value: meals[0].strArea,
              inline: true,
            }
          );
        message.channel.send(msgEmbed);
      })
      .catch((e) => {
        log(
          "ERROR",
          "./commands/misc/food.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};
