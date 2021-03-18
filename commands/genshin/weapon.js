const genshin = require("genshin-db");
const { MessageEmbed } = require("discord.js");

const stars = {
  1: "⭐",
  2: "⭐⭐",
  3: "⭐⭐⭐",
  4: "⭐⭐⭐⭐",
  5: "⭐⭐⭐⭐⭐",
};

module.exports = {
  category: "⚔️ Genshin",
  expectedArgs: "<weapon name>",
  minArgs: 1,
  description:
    "Retrieve information about a specific weapon in Genshin Impact.",
  cooldown: "15s",
  callback: ({ message, text }) => {
    const weapon = genshin.weapons(text);
    if (!weapon) {
      return message.reply(`I could not find a weapon by that name.`);
    }

    if (weapon.length) {
      return message.reply(
        `"${text}" returned more than one result. Please be more specific.`
      );
    }

    const {
      name,
      weapontype,
      rarity,
      images,
      baseatk,
      substat,
      subvalue,
      description,
      weaponmaterialtype,
      url,
    } = weapon;

    const embed = new MessageEmbed()
      .setColor("#355272")
      .setAuthor(name, images.image, url)
      .setThumbnail(images.image)
      .setDescription(
        `${description}\n\nMore info about ${name} can be found here:\n${url}`
      )
      .addFields(
        {
          name: "**Weapon Type**",
          value: weapontype,
          inline: true,
        },
        {
          name: "**Rarity**",
          value: stars[rarity],
          inline: true,
        },
        {
          name: "**Base Attack (Lvl. 1)**",
          value: baseatk,
          inline: true,
        },
        {
          name: "**Secondary Stat Type**",
          value: substat.endsWith("%")
            ? substat.substr(0, substat.length - 1)
            : substat,
          inline: true,
        },
        {
          name: "**Secondary Stat (Lvl. 1)**",
          value: substat.endsWith("%") ? `${subvalue}%` : subvalue,
          inline: true,
        },
        {
          name: "**Weapon Material Type**",
          value: weaponmaterialtype,
          inline: true,
        }
      );
    message.channel.send(embed);
  },
};
