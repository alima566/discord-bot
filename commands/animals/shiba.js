const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  category: "🐱 Animals",
  cooldown: "15s",
  description: "KelleeBot shows you a random picture/gif of a bunny.",
  callback: async ({ message, instance }) => {
    const { guild } = message;
    let m = await message.channel.send(
      instance.messageHandler.get(guild, "LOOKING_FOR_DOG")
    );
    fetch("http://shibe.online/api/shibes")
      .then((resp) => resp.json())
      .then((data) => {
        const msgEmbed = new MessageEmbed()
          .setColor("#006798")
          .setAuthor(
            `Woof!`,
            `https://i.imgur.com/cVR3t51.png`, //`https://cdn.glitch.com/2d031706-b85e-4c2b-8903-3af7e09dd1c4%2F310e3061-4bbb-400e-bb4e-59c6a4084a66_dog.png?v=1604426681901`,
            `${data[0]}`
          )
          .setURL(data[0])
          .setImage(data[0]);

        return m.edit(
          instance.messageHandler.get(guild, "FOUND_ANIMAL"),
          msgEmbed
        );
      })
      .catch((e) => {
        log(
          "ERROR",
          "./commands/animals/shiba.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};
