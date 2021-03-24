const { MessageEmbed } = require("discord.js");
const {
  sendMessageToBotLog,
  fetchAuditLog,
  guildIcon,
} = require("@utils/functions");

module.exports = (client) => {
  client.on("channelCreate", async (channel) => {
    if (channel.type.toLowerCase() === "dm") return;

    const fetchedLogs = await fetchAuditLog(channel.guild, "CHANNEL_CREATE");
    if (!fetchedLogs) {
      const msgEmbed = await createChannelEmbed(
        channel,
        null,
        `${
          channel.type.toLowerCase() === "category"
            ? "**Category"
            : channel.type.toLowerCase() === "text"
            ? "**Text Channel"
            : "**Voice Channel"
        } Created: ${
          channel.type.toLowerCase() === "text"
            ? channel
            : `\`${channel.name}\``
        }**`
      );
      return sendMessageToBotLog(client, channel.guild, msgEmbed);
    }

    const channelCreationLog = fetchedLogs.entries.first();
    if (!channelCreationLog) {
      const msgEmbed = await createChannelEmbed(
        channel,
        null,
        `${
          channel.type.toLowerCase() === "category"
            ? "**Category"
            : channel.type.toLowerCase() === "text"
            ? "**Text Channel"
            : "**Voice Channel"
        } Created: ${
          channel.type.toLowerCase() === "text"
            ? channel
            : `\`${channel.name}\``
        }\`**`
      );
      return sendMessageToBotLog(client, channel.guild, msgEmbed);
    }

    const { executor } = channelCreationLog;
    const msgEmbed = await createChannelEmbed(
      channel,
      null,
      `${
        channel.type.toLowerCase() === "category"
          ? "**Category"
          : channel.type.toLowerCase() === "text"
          ? "**Text Channel"
          : "**Voice Channel"
      } Created: ${
        channel.type.toLowerCase() === "text" ? channel : `\`${channel.name}\``
      }**\n**Created By:** ${executor}`
    );
    sendMessageToBotLog(client, channel.guild, msgEmbed);
  });

  client.on("channelDelete", async (channel) => {
    if (channel.type.toLowerCase() === "dm") return;

    const fetchedLogs = await fetchAuditLog(channel.guild, "CHANNEL_DELETE");
    if (!fetchedLogs) {
      const msgEmbed = await createChannelEmbed(
        channel,
        null,
        `${
          channel.type.toLowerCase() === "category"
            ? "**Category"
            : channel.type.toLowerCase() === "text"
            ? "**Text Channel"
            : "**Voice Channel"
        } Deleted:** \`${channel.name}\``
      );
      return sendMessageToBotLog(client, channel.guild, msgEmbed);
    }

    const channelCreationLog = fetchedLogs.entries.first();
    if (!channelCreationLog) {
      const msgEmbed = await createChannelEmbed(
        channel,
        null,
        `${
          channel.type.toLowerCase() === "category"
            ? "**Category"
            : channel.type.toLowerCase() === "text"
            ? "**Text Channel"
            : "**Voice Channel"
        } Deleted:** \`${channel.name}\``
      );
      return sendMessageToBotLog(client, channel.guild, msgEmbed);
    }

    const { executor } = channelCreationLog;
    const msgEmbed = await createChannelEmbed(
      channel,
      null,
      `${
        channel.type.toLowerCase() === "category"
          ? "**Category"
          : channel.type.toLowerCase() === "text"
          ? "**Text Channel"
          : "**Voice Channel"
      } Deleted:** \`${channel.name}\`\n**Deleted By:** ${executor}`
    );
    sendMessageToBotLog(client, channel.guild, msgEmbed);
  });

  client.on("channelUpdate", async (oldChan, newChan) => {
    if (oldChan.name !== newChan.name) {
      const msgEmbed = await createChannelEmbed(
        oldChan,
        newChan,
        `${
          newChan.type.toLowerCase() === "category"
            ? "**Category Name"
            : newChan.type.toLowerCase() === "text"
            ? "**Text Channel"
            : "**Voice Channel"
        } Changed**`
      );
      sendMessageToBotLog(client, newChan.guild, msgEmbed);
    }
  });
};

const createChannelEmbed = async (oldChan, newChan, description) => {
  const embed = new MessageEmbed()
    .setColor("GREEN")
    .setDescription(description)
    .setAuthor(
      `${newChan === null ? oldChan.guild.name : newChan.guild.name}`,
      `${
        newChan === null ? guildIcon(oldChan.guild) : guildIcon(newChan.guild)
      }`
    )
    .setTimestamp()
    .setFooter(`ID: ${oldChan.id}`);

  if (newChan !== null) {
    const fetchedLogs = await fetchAuditLog(newChan.guild, "CHANNEL_UPDATE");
    if (!fetchedLogs) {
      embed.addFields(
        {
          name: `**Before**`,
          value: `\`${oldChan.name}\``,
          inline: true,
        },
        {
          name: `**After**`,
          value:
            newChan.type.toLowerCase() === "text"
              ? newChan
              : `\`${newChan.name}\``,
          inline: true,
        }
      );
      return embed;
    }

    const channelUpdateLog = fetchedLogs.entries.first();
    if (!channelUpdateLog) {
      embed.addFields(
        {
          name: `**Before**`,
          value: `\`${oldChan.name}\``,
          inline: true,
        },
        {
          name: `**After**`,
          value:
            newChan.type.toLowerCase() === "text"
              ? newChan
              : `\`${newChan.name}\``,
          inline: true,
        }
      );
      return embed;
    }

    const { executor } = channelUpdateLog;
    embed.addFields(
      {
        name: `**Before**`,
        value: `\`${oldChan.name}\``,
        inline: true,
      },
      {
        name: `**After**`,
        value:
          newChan.type.toLowerCase() === "text"
            ? newChan
            : `\`${newChan.name}\``,
        inline: true,
      },
      { name: `**Updated By**`, value: executor, inline: true }
    );
  }
  return embed;
};

module.exports.config = {
  displayName: "Channel Events",
  dbName: "CHANNEL_EVENTS",
  loadDBFirst: false,
};
