const animals = require("random-animals-api");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  commands: ["bunny", "bunbun"],
  category: "Animals",
  cooldown: "15s",
  description: "KelleeBot shows you a random picture of a bunny.",
  callback: async (msg, args, text, client, prefix, instance) => {
    const { guild } = msg;
    let m = await msg.channel.send(
      instance.messageHandler.get(guild, "LOOKING_FOR_BUNNY")
    );
    animals
      .bunny()
      .then((url) => {
        let msgEmbed = new MessageEmbed()
          .setColor("#006798")
          .setAuthor(
            `Bunny`,
            `https://cdn.glitch.com/310e3061-4bbb-400e-bb4e-59c6a4084a66%2Frabbit.png?v=1603768383901`,
            `${url}`
          )
          .setURL(url)
          .setImage(url);
        m.edit(instance.messageHandler.get(guild, "FOUND_ANIMAL"));
        msg.channel.send(msgEmbed);
      })
      .catch((e) => {
        log(
          "ERROR",
          "./commands/animals/bunny.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};
