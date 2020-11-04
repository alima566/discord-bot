const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");
module.exports = {
  commands: "art",
  expectedArgs: "<artwork_name>",
  minArgs: 1,
  maxArgs: 1,
  description:
    "Retrieve information about a specific artwork in *Animal Crossing: New Horizons*.",
  cooldown: 15,
  callback: (msg, args, text) => {
    fetch(`https://acnhapi.com/v1/art/${args[0].toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        let link = `https://nookipedia.com/wiki/${data["file-name"]}`;
        let artName = capFirstLetter(data.name["name-USen"]);
        let msgEmbed = new MessageEmbed()
          .setColor("DARK_RED")
          .setURL(`${link}`)
          .setAuthor(`${artName}`, `${data.image_uri}`, `${link}`)
          .setDescription(
            `More info about the ${artName} can be found here:\n${link}`
          )
          .setThumbnail(`${data.image_uri}`)
          .addFields(
            {
              name: `**Buy Price**`,
              value: `${numeral(data["buy-price"]).format("0,0")}`,
              inline: true,
            },
            {
              name: `**Sell Price**`,
              value: `${numeral(data["sell-price"]).format("0,0")}`,
              inline: true,
            },
            {
              name: `**Has Fake**`,
              value: data.hasFake ? "Yes" : "No",
              inline: true,
            }
          );
        msg.channel.send(msgEmbed);
      })
      .catch((err) => {
        msg.channel.send(`I couldn't find that artwork :sob:`);
        console.log(err);
      });
  },
};

function capFirstLetter(string) {
  var words = string.trim().split(/ +/),
    output = [];

  for (var i = 0, len = words.length; i < len; i += 1) {
    output.push(words[i][0].toUpperCase() + words[i].toLowerCase().substr(1));
  }
  return output.join(" ");
}
