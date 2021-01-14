const { MessageEmbed } = require("discord.js");

module.exports = {
  category: "Info",
  cooldown: "15s",
  description: "Gives information about the server.",
  callback: ({ message }) => {
    const { guild, channel } = message;
    const { name, region, owner, memberCount, createdAt } = guild;
    const categoryChannels = guild.channels.cache.filter(
      (channel) => channel.type === "category"
    );
    const totalTextChannels = guild.channels.cache.filter(
      (c) => c.type === "text"
    ).size;
    const totalVoiceChannels = guild.channels.cache.filter(
      (c) => c.type === "voice"
    ).size;

    const msgEmbed = new MessageEmbed()
      .setColor("#DFBCF5")
      .setAuthor(name, guild.iconURL())
      .setThumbnail(guild.iconURL())
      .addFields(
        {
          name: "**Owner**",
          value: owner.user.tag,
          inline: true,
        },
        {
          name: "**Region**",
          value: region,
          inline: true,
        },
        {
          name: "**Channel Categories**",
          value: categoryChannels.size,
          inline: true,
        },
        {
          name: "**Text Channels**",
          value: totalTextChannels,
          inline: true,
        },
        {
          name: "**Voice Channels**",
          value: totalVoiceChannels,
          inline: true,
        },
        {
          name: "**Members**",
          value: memberCount,
          inline: true,
        },
        {
          name: "**Roles**",
          value: guild.roles.cache.size,
          inline: false,
        },
        {
          name: "**Role List**",
          value: getRoleList(guild),
          inline: true,
        }
      )
      .setFooter(`ID: ${guild.id} | Server Created`)
      .setTimestamp(createdAt);
    channel.send(msgEmbed);
  },
};

const getRoleList = (guild) => {
  let roles = "";
  guild.roles.cache.forEach((role) => {
    roles += `${role.name}, `;
  });
  roles = roles.substr(0, roles.length - 2);
  return roles;
};
