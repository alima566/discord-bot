const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const { log } = require("@utils/functions");

module.exports = {
  commands: ["recipe", "diy"],
  slash: "both",
  category: "🍀 AC",
  expectedArgs: "<recipe>",
  minArgs: 1,
  description:
    "Retrieve information about a specific recipe in *Animal Crossing: New Horizons*.",
  cooldown: "15s",
  callback: async ({ message, text }) => {
    text = text.trim();
    if (text.includes(" ")) {
      text = text.replace(/ +/g, "_");
    }

    try {
      const resp = await fetch(
        `https://api.nookipedia.com/nh/recipes/${text.toLowerCase()}`,
        {
          method: "GET",
          headers: {
            "X-API-KEY": process.env.NOOK_API_KEY,
            "Accept-Version": "2.0.0",
          },
        }
      );
      const data = await resp.json();
      const { url, name, image_url } = data;

      const msgEmbed = new MessageEmbed()
        .setColor("#8F5707")
        .setURL(url)
        .setAuthor(name, image_url, url)
        .setDescription(
          `More info about the ${name} can be found here:\n${url}`
        )
        .setThumbnail(image_url)
        .addFields(
          {
            name: "**Materials**",
            value: getAllMaterials(data),
            inline: true,
          },
          {
            name: "**Obtained From**",
            value: getAvailabilty(data),
            inline: true,
          },
          {
            name: "**Note**",
            value:
              getAvailabiltyNote(data).length !== 1
                ? getAvailabiltyNote(data)
                : "-",
            inline: true,
          }
        )
        .setFooter(
          `Powered by Nookipedia`,
          `https://nookipedia.com/wikilogo.png`
        );
      return message ? message.channel.send(msgEmbed) : msgEmbed;
    } catch (e) {
      const errorMsg = "I couldn't find that DIY :sob:";
      log(
        "ERROR",
        "./commands/AC/recipe.js",
        `An error has occurred: ${e.message}`
      );
      return message ? message.channel.send(errorMsg) : errorMsg;
    }
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
