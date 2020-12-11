const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
module.exports = {
  commands: "koala",
  category: "Animals",
  cooldown: "15s",
  description:
    "KelleeBot shows you a random picture of a koala and provides you with a random koala fact.",
  callback: async (msg, args, text, client, prefix, instance) => {
    const { guild } = msg;
    let m = await msg.channel.send(
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
            let msgEmbed = new MessageEmbed()
              .setColor("#006798")
              .setAuthor(
                `Koala`,
                `https://cdn.glitch.com/2d031706-b85e-4c2b-8903-3af7e09dd1c4%2F310e3061-4bbb-400e-bb4e-59c6a4084a66_koala.png?v=1604426664677`,
                `${img.link}`
              )
              //.setTitle("🐨 Koala")
              .setURL(img.link)
              .setImage(img.link)
              .addFields({
                name: `**Random Koala Fact**`,
                value: `${fact ? fact : "-"}`,
                inline: true,
              });
            m.edit(instance.messageHandler.get(guild, "FOUND_ANIMAL"));
            msg.channel.send(msgEmbed);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.log(err));
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
    } catch (err) {
      console.log(err);
      reject(`There was a problem retrieving a koala fact.`);
    }
  });
}
