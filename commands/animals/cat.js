const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  commands: ["kitty"],
  category: "🐱 Animals",
  cooldown: "15s",
  description:
    "KelleeBot shows you a random picture of a cat and provides you with a random cat fact.",
  callback: async ({ message, instance }) => {
    const { guild } = message;
    let m = await message.channel.send(
      instance.messageHandler.get(guild, "LOOKING_FOR_KITTY")
    );
    fetch(`https://api.thecatapi.com/v1/images/search`, {
      method: "GET",
      headers: {
        "x-api-key": process.env.CAT_API_KEY,
      },
    })
      .then((resp) => resp.json())
      .then((img) => {
        getRandomCatFact()
          .then((fact) => {
            const msgEmbed = new MessageEmbed()
              .setColor("#006798")
              .setAuthor(
                `Meow`,
                `https://i.imgur.com/tIpfnH6.png`, //`https://cdn.glitch.com/2d031706-b85e-4c2b-8903-3af7e09dd1c4%2F310e3061-4bbb-400e-bb4e-59c6a4084a66_cat.png?v=1604426698265`,
                `${img[0].url}`
              )
              .setURL(img[0].url)
              .setImage(img[0].url);

            if (fact) {
              msgEmbed.addFields({
                name: `**Random Cat Fact**`,
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
              "./commands/animals/cat.js",
              `An error has occurred: ${e.message}`
            );
          });
      })
      .catch((e) => {
        log(
          "ERROR",
          "./commands/animals/cat.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};

const getRandomCatFact = () => {
  return new Promise(async function (resolve, reject) {
    const URL = `https://meowfacts.herokuapp.com/`; //`https://some-random-api.ml/facts/cat`;
    const header = {
      method: "GET",
      parse: "JSON",
    };
    try {
      const body = await fetch(URL, { header });
      const result = await body.json();
      //const fact = result.fact;
      const fact = result.data[0];
      resolve(fact);
    } catch (e) {
      log(
        "ERROR",
        "./commands/animals/cat.js",
        `An error has occurred: ${e.message}`
      );
      reject(`There was a problem retrieving a cat fact.`);
    }
  });
};
