const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");
const constants = require("@utils/constants");
module.exports = {
  commands: ["recipe", "diy"],
  category: "AC",
  expectedArgs: "<diy_name>",
  minArgs: 1,
  maxArgs: 1,
  description:
    "Retrieve information about a specific recipe in *Animal Crossing: New Horizons*.",
  cooldown: "15s",
  callback: (msg, args) => {
    fetch(`https://api.nookipedia.com/nh/recipes/${args[0].toLowerCase()}`, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.NOOK_API_KEY,
        "Accept-Version": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let msgEmbed = new MessageEmbed()
          .setColor("#8F5707")
          .setURL(`${data.url}`)
          .setAuthor(`${data.name}`, `${data.image_url}`, `${data.url}`)
          .setDescription(
            `More info about the ${data.name} can be found here:\n${data.url}`
          )
          .setThumbnail(`${data.image_url}`)
          .addFields(
            {
              name: `**DIY Sell Price**`,
              value: `${numeral(data.sell).format("0,0")}`,
              inline: true,
            },
            {
              name: `**Materials**`,
              value: `${getAllMaterials(data)}`,
              inline: true,
            },
            {
              name: `**Obtained From**`,
              value: `${getAvailabilty(data)}`,
              inline: true,
            }
          );
        msg.channel.send(msgEmbed);
      })
      .catch((err) => {
        msg.channel.send(`I couldn't find that DIY :sob:`);
        console.log(err);
      });
  },
};

const getAllMaterials = (data) => {
  let materials = "";
  data.materials.forEach((mat) => {
    materials += `${mat.count}x ${mat.name}\n`;
  });
  return materials;
};

const getAvailabilty = (data) => {
  let availability = "";
  data.availability.forEach((avail) => {
    availability += `${avail.from}\n`;
  });
  return availability;
};
