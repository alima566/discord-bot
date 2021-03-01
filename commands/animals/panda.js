const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  commands: "panda",
  category: "Animals",
  cooldown: "15s",
  description:
    "KelleeBot shows you a random picture of a panda and provides you with a random panda fact.",
  callback: async ({ message, instance }) => {
    const { guild } = message;
    let m = await message.channel.send(
      instance.messageHandler.get(guild, "LOOKING_FOR_PANDA")
    );
    fetch(`https://some-random-api.ml/img/panda`, {
      method: "GET",
      parse: "JSON",
    })
      .then((resp) => resp.json())
      .then((img) => {
        getRandomPandaFact()
          .then((fact) => {
            const msgEmbed = new MessageEmbed()
              .setColor("#006798")
              .setAuthor(
                `Panda`,
                `https://i.imgur.com/4eUGXKU.png`, //`https://cdn.glitch.com/2d031706-b85e-4c2b-8903-3af7e09dd1c4%2F310e3061-4bbb-400e-bb4e-59c6a4084a66_emoji-panda.png?v=1604426627884`,
                `${img.link}`
              )
              .setURL(img.link)
              .setImage(img.link)
              .addFields({
                name: `**Random Panda Fact**`,
                value: `${fact ? fact : "-"}`,
                inline: true,
              });
            m.edit(instance.messageHandler.get(guild, "FOUND_ANIMAL"));
            message.channel.send(msgEmbed);
          })
          .catch((e) => {
            log(
              "ERROR",
              "./commands/animals/panda.js",
              `An error has occurred: ${e.message}`
            );
          });
      })
      .catch((e) => {
        log(
          "ERROR",
          "./commands/animals/panda.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};

function getRandomPandaFact() {
  return new Promise(async function (resolve, reject) {
    const URL = `https://some-random-api.ml/facts/panda`;
    const header = {
      method: "GET",
      parse: "JSON",
    };
    try {
      const body = await fetch(URL, { header });
      const result = await body.json();
      const fact = result.fact;
      resolve(fact);
    } catch (e) {
      log(
        "ERROR",
        "./commands/animals/panda.js",
        `An error has occurred: ${e.message}`
      );
      reject(`There was a problem retrieving a panda fact.`);
    }
  });
}
