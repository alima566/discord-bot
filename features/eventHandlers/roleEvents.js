const { MessageEmbed } = require("discord.js");
const { sendMessageToBotLog, fetchAuditLog } = require("@utils/functions");

module.exports = (client) => {
  client.on("roleCreate", async (role) => {
    const msgEmbed = createEmbed("YELLOW", role.guild, role, "");

    const fetchedLogs = await fetchAuditLog(role.guild, "ROLE_CREATE");
    if (!fetchedLogs) {
      msgEmbed.setDescription(`**Role Created:** \`${role.name}\``);
      return sendMessageToBotLog(client, role.guild, msgEmbed);
    }

    const roleCreationLog = fetchedLogs.entries.first();
    if (!roleCreationLog) {
      msgEmbed.setDescription(`**Role Created:** \`${role.name}\``);
      return sendMessageToBotLog(client, role.guild, msgEmbed);
    }

    const { executor } = roleCreationLog;
    msgEmbed.setDescription(
      `**Role Created:** \`${role.name}\`\n**Role Created By:** ${executor}`
    );
    sendMessageToBotLog(client, role.guild, msgEmbed);
  });

  client.on("roleDelete", async (role) => {
    const msgEmbed = createEmbed("YELLOW", role.guild, role, "");

    const fetchedLogs = await fetchAuditLog(role.guild, "ROLE_DELETE");
    if (!fetchedLogs) {
      msgEmbed.setDescription(`**Role Deleted:** \`${role.name}\``);
      return sendMessageToBotLog(client, role.guild, msgEmbed);
    }

    const roleDeletionLog = fetchedLogs.entries.first();
    if (!roleDeletionLog) {
      msgEmbed.setDescription(`**Role Deleted:** \`${role.name}\``);
      return sendMessageToBotLog(client, role.guild, msgEmbed);
    }

    const { executor } = roleDeletionLog;
    msgEmbed.setDescription(
      `**Role Deleted:** \`${role.name}\`\n**Role Deleted By:** ${executor}`
    );

    sendMessageToBotLog(client, role.guild, msgEmbed);
  });

  client.on("roleUpdate", async (oldRole, newRole) => {
    if (
      oldRole.name !== newRole.name &&
      (!oldRole.deleted || !newRole.deleted)
    ) {
      const msgEmbed = createEmbed("YELLOW", newRole.guild, newRole, "");

      const fetchedLogs = await fetchAuditLog(newRole.guild, "ROLE_CREATE");
      if (!fetchedLogs) {
        msgEmbed.addFields(
          { name: `**Before**`, value: `\`${oldRole.name}\``, inline: true },
          { name: `**After**`, value: `\`${newRole.name}\``, inline: true }
        );
        return sendMessageToBotLog(client, newRole.guild, msgEmbed);
      }

      const roleUpdateLog = fetchedLogs.entries.first();
      if (!roleUpdateLog) {
        msgEmbed.addFields(
          { name: `**Before**`, value: `\`${oldRole.name}\``, inline: true },
          { name: `**After**`, value: `\`${newRole.name}\``, inline: true }
        );
        return sendMessageToBotLog(client, newRole.guild, msgEmbed);
      }

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
      sendMessageToBotLog(client, newRole.guild, msgEmbed);
    }
  });
};

const createEmbed = (color, guild, role, description) => {
  return new MessageEmbed()
    .setColor(color)
    .setAuthor(guild.name, guild.iconURL())
    .setDescription(description)
    .setTimestamp()
    .setFooter(`ID: ${role.id}`);
};

module.exports.config = {
  displayName: "Role Events",
  dbName: "ROLE_EVENTS",
  loadDBFirst: false,
};
