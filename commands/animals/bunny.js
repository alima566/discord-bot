//const animals = require("random-animals-api");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");
const fetch = require("node-fetch");

module.exports = {
  commands: ["bunny", "bunbun"],
  category: "Animals",
  cooldown: "15s",
  description: "KelleeBot shows you a random picture/gif of a bunny.",
  callback: async ({ message, instance }) => {
    const { guild } = message;
    let m = await message.channel.send(
      instance.messageHandler.get(guild, "LOOKING_FOR_BUNNY")
    );
    fetch("https://api.bunnies.io/v2/loop/random/?media=gif,png")
      .then((resp) => resp.json())
      .then((data) => {
        const msgEmbed = new MessageEmbed()
          .setColor("#006798")
          .setAuthor(
            `Bunny`,
            "https://i.imgur.com/VUbJXOA.png", //`https://cdn.glitch.com/310e3061-4bbb-400e-bb4e-59c6a4084a66%2Frabbit.png?v=1603768383901`,
            `${data.media.gif}` //${data.media.poster}
          )
          .setURL(`${data.media.gif}`)
          .setImage(`${data.media.gif}`);
        m.edit(instance.messageHandler.get(guild, "FOUND_ANIMAL"));
        message.channel.send(msgEmbed);
      })
      .catch((e) => {
        log(
          "ERROR",
          "./commands/animals/bunny.js",
          `An error has occurred: ${e.message}`
        );
      });

    // animals
    //   .bunny()
    //   .then((url) => {
    //     let msgEmbed = new MessageEmbed()
    //       .setColor("#006798")
    //       .setAuthor(
    //         `Bunny`,
    //         `https://cdn.glitch.com/310e3061-4bbb-400e-bb4e-59c6a4084a66%2Frabbit.png?v=1603768383901`,
    //         `${url}`
    //       )
    //       .setURL(url)
    //       .setImage(url);
    //     m.edit(instance.messageHandler.get(guild, "FOUND_ANIMAL"));
    //     msg.channel.send(msgEmbed);
    //   })
    //   .catch((e) => {
    //     log(
    //       "ERROR",
    //       "./commands/animals/bunny.js",
    //       `An error has occurred: ${e.message}`
    //     );
    //   });
  },
};
