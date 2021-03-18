const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  commands: ["dog", "doggo"],
  category: "🐱 Animals",
  cooldown: "15s",
  description:
    "KelleeBot shows you a random picture of a dog and provides you with a random dog fact.",
  callback: async ({ message, instance }) => {
    const { guild } = message;
    let m = await message.channel.send(
      instance.messageHandler.get(guild, "LOOKING_FOR_DOG")
    );
    fetch(`https://api.thedogapi.com/v1/images/search`, {
      method: "GET",
      headers: {
        "x-api-key": process.env.DOG_API_KEY,
      },
    })
      .then((resp) => resp.json())
      .then((img) => {
        getRandomDogFact()
          .then((fact) => {
            const msgEmbed = new MessageEmbed()
              .setColor("#006798")
              .setAuthor(
                `Woof!`,
                `https://i.imgur.com/cVR3t51.png`, //`https://cdn.glitch.com/2d031706-b85e-4c2b-8903-3af7e09dd1c4%2F310e3061-4bbb-400e-bb4e-59c6a4084a66_dog.png?v=1604426681901`,
                `${img[0].url}`
              )
              .setURL(img[0].url)
              .setImage(img[0].url)
              .addFields({
                name: `**Random Dog Fact**`,
                value: `${fact ? fact : "-"}`,
                inline: true,
              });
            m.edit(instance.messageHandler.get(guild, "FOUND_ANIMAL"));
            message.channel.send(msgEmbed);
          })
          .catch((e) => {
            log(
              "ERROR",
              "./commands/animals/dog.js",
              `An error has occurred: ${e.message}`
            );
          })
          .catch((e) => {
            log(
              "ERROR",
              "./commands/animals/dog.js",
              `An error has occurred: ${e.message}`
            );
          });
      });
    /*
        fetch(`https://dog.ceo/api/breeds/image/random`)
      .then(response => response.json())
      .then(data => {
        msg.channel.send(`${data["message"]}`);
      })
      .catch(err => {
        console.log(err);
      });
      */
  },
};

function getRandomDogFact() {
  return new Promise(async function (resolve, reject) {
    const URL = `https://some-random-api.ml/facts/dog`;
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
        "./commands/animals/dog.js",
        `An error has occurred: ${e.message}`
      );
      reject(`There was a problem retrieving a dog fact.`);
    }
  });
}
