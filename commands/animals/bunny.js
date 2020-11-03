const animals = require("random-animals-api");
const { MessageEmbed } = require("discord.js");
module.exports = {
  commands: ["bunny", "rabbit"],
  cooldown: 15,
  description: "KelleeBot shows you a random picture of a bunny.",
  callback: async (msg, args, text) => {
    let m = await msg.channel.send(`Looking for a bunny...`);
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
          //.setTitle("🐱 Meow")
          .setURL(url)
          .setImage(url);
        m.edit(`Found one!`);
        msg.channel.send(msgEmbed);
      })
      .catch((err) => console.log(err));
  },
};
/*animals.cat()
    .then(url => console.log(url))
    .catch((error) => console.error(error));*/
