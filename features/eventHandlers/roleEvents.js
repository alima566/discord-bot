const { MessageEmbed } = require("discord.js");
const { sendMessageToBotThings } = require("@utils/functions");

module.exports = (client) => {
  client.on("roleCreate", async (role) => {
    const msgEmbed = new MessageEmbed()
      .setColor("YELLOW")
      .setDescription(`**Role Created: ${role.name}**`)
      .setAuthor(`${role.guild.name}`, role.guild.iconURL())
      .setTimestamp()
      .setFooter(`ID: ${role.id}`);
    sendMessageToBotThings(client, role.guild, msgEmbed);
  });

  client.on("roleDelete", async (role) => {
    const msgEmbed = new MessageEmbed()
      .setColor("YELLOW")
      .setDescription(`**Role Deleted: ${role.name}**`)
      .setAuthor(`${role.guild.name}`, role.guild.iconURL())
      .setTimestamp()
      .setFooter(`ID: ${role.id}`);
    sendMessageToBotThings(client, role.guild, msgEmbed);
  });

  client.on("roleUpdate", async (oldRole, newRole) => {
    if (
      oldRole.name !== newRole.name &&
      (!oldRole.deleted || !newRole.deleted)
    ) {
      const msgEmbed = new MessageEmbed()
        .setColor("YELLOW")
        .setDescription(`**Role Name Changed**`)
        .addFields(
          { name: `**Before**`, value: `${oldRole.name}`, inline: true },
          { name: `**After**`, value: `${newRole.name}`, inline: true }
        )
        .setAuthor(`${newRole.guild.name}`, newRole.guild.iconURL())
        .setTimestamp()
        .setFooter(`ID: ${newRole.id}`);
      sendMessageToBotThings(client, newRole.guild, msgEmbed);
    }
  });
};

module.exports.config = {
  displayName: "Role Events",
  dbName: "ROLE_EVENTS",
  loadDBFirst: false,
};
