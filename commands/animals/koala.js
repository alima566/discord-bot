const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  category: "🐱 Animals",
  cooldown: "15s",
  description:
    "KelleeBot shows you a random picture of a koala and provides you with a random koala fact.",
  callback: async ({ message, instance }) => {
    const { guild } = message;
    let m = await message.channel.send(
      instance.messageHandler.get(guild, "LOOKING_FOR_KOALA")
    );
    fetch(`https://some-random-api.ml/img/koala`, {
      method: "GET",
      parse: "JSON",
    })
      .then((resp) => resp.json())
      .then((img) => {
        getRandomKoalaFact()
          .then((fact) => {
            const msgEmbed = new MessageEmbed()
              .setColor("#006798")
              .setAuthor(
                `Koala`,
                `https://i.imgur.com/JFu7FBu.png`, //`https://cdn.glitch.com/2d031706-b85e-4c2b-8903-3af7e09dd1c4%2F310e3061-4bbb-400e-bb4e-59c6a4084a66_koala.png?v=1604426664677`,
                `${img.link}`
              )
              .setURL(img.link)
              .setImage(img.link);

            if (fact) {
              msgEmbed.addFields({
                name: `**Random Koala Fact**`,
                value: fact,
                inline: true,
              });
            }

            return m.edit(
              instance.messageHandler.get(guild, "FOUND_ANIMAL"),
              msgEmbed
            );
          })
          .catch((e) => {
            log(
              "ERROR",
              "./commands/animals/koala.js",
              `An error has occurred: ${e.message}`
            );
          });
      })
      .catch((err) => {
        log(
          "ERROR",
          "./commands/animals/koala.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};

function getRandomKoalaFact() {
  return new Promise(async function (resolve, reject) {
    const URL = `https://some-random-api.ml/facts/koala`;
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
        "./commands/animals/koala.js",
        `An error has occurred: ${e.message}`
      );
      reject(`There was a problem retrieving a koala fact.`);
    }
  });
}
