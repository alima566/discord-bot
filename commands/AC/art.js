const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");
module.exports = {
  commands: "art",
  category: "AC",
  expectedArgs: "<artwork_name>",
  minArgs: 1,
  maxArgs: 1,
  description:
    "Retrieve information about a specific artwork in *Animal Crossing: New Horizons*.",
  cooldown: "15s",
  callback: (msg, args) => {
    fetch(`https://api.nookipedia.com/nh/art/${args[0].toLowerCase()}`, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.NOOK_API_KEY,
        "Accept-Version": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let msgEmbed = new MessageEmbed()
          .setColor("DARK_RED")
          .setURL(`${data.url}`)
          .setAuthor(`${data.name}`, `${data.image_url}`, `${data.url}`)
          .setDescription(
            `More info about the ${data.name} can be found here:\n${data.url}`
          )
          .setThumbnail(`${data.image_url}`)
          .addFields(
            {
              name: `**Buy Price**`,
              value: `${numeral(data.buy).format("0,0")}`,
              inline: true,
            },
            {
              name: `**Sell Price**`,
              value: `${numeral(data.sell).format("0,0")}`,
              inline: true,
            },
            {
              name: `**Has Fake**`,
              value: data.has_fake ? "Yes" : "No",
              inline: true,
            },
            {
              name: `**Authenticity**`,
              value: !data.authenticity
                ? `This artwork is always genuine.`
                : data.authenticity,
              inline: true,
            }
          )
          .setFooter(
            `Powered by Nookipedia`,
            `https://dodo.ac/np/images/thumb/9/99/Nookipedia_Leaf_%26_Text_%28Autumn%29.png/179px-Nookipedia_Leaf_%26_Text_%28Autumn%29.png`
          );
        msg.channel.send(msgEmbed);
      })
      .catch((err) => {
        msg.channel.send(`I couldn't find that artwork :sob:`);
        console.log(err);
      });
  },
};
