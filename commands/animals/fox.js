const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  commands: "fox",
  category: "Animals",
  cooldown: "15s",
  description:
    "KelleeBot shows you a random picture of a fox and provides you with a random fox fact.",
  callback: async ({ message, instance }) => {
    const { guild } = message;
    let m = await message.channel.send(
      instance.messageHandler.get(guild, "LOOKING_FOR_FOX")
    );
    fetch(`https://randomfox.ca/floof`)
      .then((resp) => resp.json())
      .then((img) => {
        getRandomFoxFact()
          .then((fact) => {
            const msgEmbed = new MessageEmbed()
              .setColor("#006798")
              .setAuthor(
                `Fox`,
                `https://i.imgur.com/LlnzRZj.png`, //`https://cdn.glitch.com/2d031706-b85e-4c2b-8903-3af7e09dd1c4%2F310e3061-4bbb-400e-bb4e-59c6a4084a66_fox.png?v=1604426646640`,
                `${img.link}`
              )
              .setURL(img.link)
              .setImage(img.image)
              .addFields({
                name: `**Random Fox Fact**`,
                value: `${fact ? fact : "-"}`,
                inline: true,
              });
            m.edit(instance.messageHandler.get(guild, "FOUND_ANIMAL"));
            message.channel.send(msgEmbed);
          })
          .catch((e) => {
            log(
              "ERROR",
              "./commands/animals/fox.js",
              `An error has occurred: ${e.message}`
            );
          });
      })
      .catch((e) => {
        log(
          "ERROR",
          "./commands/animals/fox.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};

function getRandomFoxFact() {
  return new Promise(async function (resolve, reject) {
    const URL = `https://some-random-api.ml/facts/fox`;
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
        "./commands/animals/fox.js",
        `An error has occurred: ${e.message}`
      );
      reject(`There was a problem retrieving a fox fact.`);
    }
  });
}
