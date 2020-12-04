const { MessageEmbed } = require("discord.js");
const constants = require("@utils/constants");
const msgEmbed = new MessageEmbed().setColor("YELLOW");
module.exports = (client) => {
  client.on("roleCreate", async (role) => {
    msgEmbed
      .setDescription(`**Role Created: ${role.name}**`)
      .setAuthor(`${role.guild.name}`, role.guild.iconURL())
      .setTimestamp()
      .setFooter(`ID: ${role.id}`);
    constants.sendMessageToBotThings(client, role.guild, msgEmbed);
    console.log("ROLE CREATED");
  });

  client.on("roleDelete", async (role) => {
    msgEmbed
      .setDescription(`**Role Deleted: ${role.name}**`)
      .setAuthor(`${role.guild.name}`, role.guild.iconURL())
      .setTimestamp()
      .setFooter(`ID: ${role.id}`);
    constants.sendMessageToBotThings(client, role.guild, msgEmbed);
    console.log("ROLE DELETED");
  });

  client.on("roleUpdate", async (oldRole, newRole) => {
    if (!oldRole.deleted || !newRole.deleted) {
      msgEmbed
        .setDescription(`**Role Name Changed**`)
        .addFields(
          { name: `**Before**`, value: `${oldRole.name}`, inline: true },
          { name: `**After**`, value: `${newRole.name}`, inline: true }
        )
        .setAuthor(`${newRole.guild.name}`, newRole.guild.iconURL())
        .setTimestamp()
        .setFooter(`ID: ${newRole.id}`);
      constants.sendMessageToBotThings(client, newRole.guild, msgEmbed);
    }
  });
};
