const { MessageEmbed } = require("discord.js");
const { sendMessageToBotLog, fetchAuditLog } = require("@utils/functions");
const messageEvents = require("./messageEvents");

module.exports = (client) => {
  client.on("roleCreate", async (role) => {
    const msgEmbed = new MessageEmbed()
      .setColor("YELLOW")
      .setAuthor(`${role.guild.name}`, role.guild.iconURL())
      .setTimestamp()
      .setFooter(`ID: ${role.id}`);

    const fetchedLogs = await fetchAuditLog(role.guild, "ROLE_CREATE");
    const roleCreationLog = fetchedLogs.entries.first();
    if (!roleCreationLog) {
      msgEmbed.setDescription(`**Role Created:** \`${role.name}\``);
    } else {
      const { executor } = roleCreationLog;
      msgEmbed.setDescription(
        `**Role Created:** \`${role.name}\`\n**Role Created By:** ${executor}`
      );
    }
    sendMessageToBotLog(client, role.guild, msgEmbed);
  });

  client.on("roleDelete", async (role) => {
    const msgEmbed = new MessageEmbed()
      .setColor("YELLOW")
      .setAuthor(`${role.guild.name}`, role.guild.iconURL())
      .setTimestamp()
      .setFooter(`ID: ${role.id}`);

    const fetchedLogs = await fetchAuditLog(role.guild, "ROLE_DELETE");
    const roleDeletionLog = fetchedLogs.entries.first();
    if (!roleDeletionLog) {
      msgEmbed.setDescription(`**Role Deleted:** \`${role.name}\``);
    } else {
      const { executor } = roleDeletionLog;
      msgEmbed.setDescription(
        `**Role Deleted:** \`${role.name}\`\n**Role Deleted By:** ${executor}`
      );
    }
    sendMessageToBotLog(client, role.guild, msgEmbed);
  });

  client.on("roleUpdate", async (oldRole, newRole) => {
    if (
      oldRole.name !== newRole.name &&
      (!oldRole.deleted || !newRole.deleted)
    ) {
      const msgEmbed = new MessageEmbed()
        .setColor("YELLOW")
        .setAuthor(`${newRole.guild.name}`, newRole.guild.iconURL())
        .setDescription(`**Role Name Changed**`)
        .setTimestamp()
        .setFooter(`ID: ${newRole.id}`);

      const fetchedLogs = await fetchAuditLog(newRole.guild, "ROLE_CREATE");
      const roleUpdateLog = fetchedLogs.entries.first();
      if (!roleUpdateLog) {
        msgEmbed.addFields(
          { name: `**Before**`, value: `\`${oldRole.name}\``, inline: true },
          { name: `**After**`, value: `\`${newRole.name}\``, inline: true }
        );
      } else {
        const { executor } = roleUpdateLog;
        msgEmbed.addFields(
          {
            name: `**Before**`,
            value: `\`${oldRole.name}\``,
            inline: true,
          },
          {
            name: `**After**`,
            value: `\`${newRole.name}\``,
            inline: true,
          },
          {
            name: `**Changed By**`,
            value: executor,
            inline: true,
          }
        );
      }
      sendMessageToBotLog(client, newRole.guild, msgEmbed);
    }
  });
};

module.exports.config = {
  displayName: "Role Events",
  dbName: "ROLE_EVENTS",
  loadDBFirst: false,
};
