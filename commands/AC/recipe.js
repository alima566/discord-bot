const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  commands: ["recipe", "diy"],
  category: "AC",
  expectedArgs: "<diy_name>",
  minArgs: 1,
  //maxArgs: 1,
  description:
    "Retrieve information about a specific recipe in *Animal Crossing: New Horizons*.",
  cooldown: "15s",
  callback: ({ message, text }) => {
    if (text.includes(" ")) {
      text = text.replace(/ +/g, "_");
    }
    fetch(`https://api.nookipedia.com/nh/recipes/${text.toLowerCase()}`, {
      method: "GET",
      headers: {
        "X-API-KEY": process.env.NOOK_API_KEY,
        "Accept-Version": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const msgEmbed = new MessageEmbed()
          .setColor("#8F5707")
          .setURL(`${data.url}`)
          .setAuthor(`${data.name}`, `${data.image_url}`, `${data.url}`)
          .setDescription(
            `More info about the ${data.name} can be found here:\n${data.url}`
          )
          .setThumbnail(`${data.image_url}`)
          .addFields(
            {
              name: `**Materials**`,
              value: `${getAllMaterials(data)}`,
              inline: true,
            },
            {
              name: `**Obtained From**`,
              value: `${getAvailabilty(data)}`,
              inline: true,
            },
            {
              name: `**Note**`,
              value: `${
                getAvailabiltyNote(data).length !== 1
                  ? getAvailabiltyNote(data)
                  : "-"
              }`,
              inline: true,
            }
          )
          .setFooter(
            `Powered by Nookipedia`,
            `https://nookipedia.com/wikilogo.png`
          );
        message.channel.send(msgEmbed);
      })
      .catch((e) => {
        message.channel.send(`I couldn't find that DIY :sob:`);
        log(
          "ERROR",
          "./commands/AC/recipe.js",
          `An error has occurred: ${e.message}`
        );
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

const getAvailabiltyNote = (data) => {
  let availabilityNote = "";
  data.availability.forEach((avail) => {
    availabilityNote += `${avail.note}\n`;
  });
  return availabilityNote;
};
