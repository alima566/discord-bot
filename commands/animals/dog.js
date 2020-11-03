const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
module.exports = {
  commands: ["dog", "doggo"],
  cooldown: 15,
  description:
    "KelleeBot shows you a random picture of a dog and provides you with a random dog fact.",
  callback: async (msg, args, text) => {
    let m = await msg.channel.send(`Looking for a doggo...`);
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
            let msgEmbed = new MessageEmbed()
              .setColor("#006798")
              .setAuthor(
                `Woof!`,
                `https://cdn.glitch.com/310e3061-4bbb-400e-bb4e-59c6a4084a66%2Fdog.png?v=1603519493542`,
                `${img[0].url}`
              )
              //.setTitle("🐶 Woof!")
              .setURL(img[0].url)
              .setImage(img[0].url)
              .addFields({
                name: `**Random Dog Fact**`,
                value: `${fact ? fact : "-"}`,
                inline: true,
              });
            m.edit(`Found a good boi!`);
            msg.channel.send(msgEmbed);
          })
          .catch((err) => console.log(err))
          .catch((err) => console.log(err));
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
    } catch (err) {
      console.log(err);
      reject(`There was a problem retrieving a dog fact.`);
    }
  });
}
