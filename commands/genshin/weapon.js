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
  slash: "both",
  category: "⚔️ Genshin",
  expectedArgs: "<weapon>",
  minArgs: 1,
  description:
    "Retrieve information about a specific weapon in Genshin Impact.",
  cooldown: "15s",
  callback: ({ message, text }) => {
    const weapon = genshin.weapons(text);
    if (!weapon) {
      const noResults = "I could not find a weapon by that name.";
      return message ? message.reply(noResults) : noResults;
    }

    if (weapon.length) {
      const multipleResults = `"${text}" returned more than one result. Please be more specific.`;
      return message ? message.reply(multipleResults) : multipleResults;
    }

    const {
      name,
      weapontype,
      rarity,
      images,
      baseatk,
      substat,
      subvalue,
      effectname,
      effect,
      description,
      weaponmaterialtype,
      url,
    } = weapon;

    const msgEmbed = new MessageEmbed()
      .setColor("#355272")
      .setAuthor(name, images.image, url)
      .setThumbnail(images.image)
      .setDescription(`${description}\n[Read More](${url})`)
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
        },
        {
          name: "**Effect Name**",
          value: effectname,
          inline: true,
        },
        {
          name: "**Effect**",
          value: effect,
          inline: false,
        }
      );
    return message ? message.channel.send(msgEmbed) : msgEmbed;
  },
};
