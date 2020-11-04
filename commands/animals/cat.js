const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
module.exports = {
  commands: ["cat", "kitty"],
  cooldown: 15,
  description:
    "KelleeBot shows you a random picture of a cat and provides you with a random cat fact.",
  callback: async (msg, args, text) => {
    let m = await msg.channel.send(`Looking for a kitty...`);
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
            let msgEmbed = new MessageEmbed()
              .setColor("#006798")
              .setAuthor(
                `Meow`,
                `../../img/310e3061-4bbb-400e-bb4e-59c6a4084a66_cat.png`,
                //`https://cdn.glitch.com/2d031706-b85e-4c2b-8903-3af7e09dd1c4%2F310e3061-4bbb-400e-bb4e-59c6a4084a66_cat.png?v=1604426698265`,
                `${img[0].url}`
              )
              //.setTitle("🐱 Meow")
              .setURL(img[0].url)
              .setImage(img[0].url)
              .addFields({
                name: `**Random Cat Fact**`,
                value: `${fact ? fact : "-"}`,
                inline: true,
              });
            m.edit(`Found one!`);
            msg.channel.send(msgEmbed);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

function getRandomCatFact() {
  return new Promise(async function (resolve, reject) {
    const URL = `https://some-random-api.ml/facts/cat`;
    const header = {
      method: "GET",
      parse: "JSON",
    };
    try {
      const body = await fetch(URL, { header });
      const result = await body.json();
      const fact = result.fact;
      resolve(fact);
    } catch (err) {
      console.log(err);
      reject(`There was a problem retrieving a cat fact.`);
    }
  });
}
