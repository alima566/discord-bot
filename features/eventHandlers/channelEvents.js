const { MessageEmbed } = require("discord.js");
const { sendMessageToBotLog, fetchAuditLog } = require("@utils/functions");

module.exports = (client) => {
  client.on("channelCreate", async (channel) => {
    let embed = null;
    if (channel.type.toLowerCase() === "dm") return;

    const fetchedLogs = await fetchAuditLog(channel.guild, "CHANNEL_CREATE");
    const channelCreationLog = fetchedLogs.entries.first();

    if (channel.type.toLowerCase() === "category") {
      if (channelCreationLog) {
        const { executor } = channelCreationLog;
        embed = await createChannelEmbed(
          channel,
          null,
          `**Category Created:** ${channel.name}\n**Created By:** ${executor}`
        );
      }
    } else if (channel.type.toLowerCase() === "text") {
      if (channelCreationLog) {
        const { executor } = channelCreationLog;
        embed = await createChannelEmbed(
          channel,
          null,
          `**Text Channel Created:** ${channel}\n**Created By:** ${executor}`
        );
      }
    } else if (channel.type.toLowerCase() === "voice") {
      if (channelCreationLog) {
        const { executor } = channelCreationLog;
        embed = await createChannelEmbed(
          channel,
          null,
          `**Voice Channel Created:** ${channel.name}\n**Created By:** ${executor}`
        );
      }
    }
    sendMessageToBotLog(client, channel.guild, embed);
  });

  client.on("channelDelete", async (channel) => {
    let embed = null;
    const fetchedLogs = await fetchAuditLog(channel.guild, "CHANNEL_DELETE");
    const channelDeletionLog = fetchedLogs.entries.first();

    if (channel.type.toLowerCase() === "category") {
      if (channelDeletionLog) {
        const { executor } = channelDeletionLog;
        embed = await createChannelEmbed(
          channel,
          null,
          `**Category Deleted:** ${channel.name}\n**Deleted By:** ${executor}`
        );
      }
    } else if (channel.type.toLowerCase() === "text") {
      if (channelDeletionLog) {
        const { executor } = channelDeletionLog;
        embed = await createChannelEmbed(
          channel,
          null,
          `**Channel Deleted:** #${channel.name}\n**Deleted By:** ${executor}`
        );
      }
    } else if (channel.type.toLowerCase() === "voice") {
      if (channelDeletionLog) {
        const { executor } = channelDeletionLog;
        embed = await createChannelEmbed(
          channel,
          null,
          `**Voice Channel Deleted:** ${channel.name}\n**Deleted By:** ${executor}`
        );
      }
    }
    sendMessageToBotLog(client, channel.guild, embed);
  });

  client.on("channelUpdate", async (oldChan, newChan) => {
    let embed = null;
    if (oldChan.name !== newChan.name) {
      if (newChan.type.toLowerCase() === "category") {
        embed = await createChannelEmbed(
          oldChan,
          newChan,
          `**Category Name Changed**`
        );
      } else if (newChan.type.toLowerCase() === "text") {
        embed = await createChannelEmbed(
          oldChan,
          newChan,
          `**Channel Name Changed**`
        );
      } else if (newChan.type.toLowerCase() === "voice") {
        embed = await createChannelEmbed(
          oldChan,
          newChan,
          `**Voice Channel Name Changed**`
        );
      }
      sendMessageToBotLog(client, newChan.guild, embed);
    }
  });
};

const createChannelEmbed = async (oldChan, newChan, description) => {
  const embed = new MessageEmbed()
    .setColor("GREEN")
    .setDescription(description)
    .setAuthor(
      `${newChan === null ? oldChan.guild.name : newChan.guild.name}`,
      `${newChan === null ? oldChan.guild.iconURL() : newChan.guild.iconURL()}`
    )
    .setTimestamp()
    .setFooter(`ID: ${oldChan.id}`);

  if (newChan !== null) {
    const fetchedLogs = await fetchAuditLog(newChan.guild, "CHANNEL_UPDATE");
    const channelUpdateLog = fetchedLogs.entries.first();

    if (channelUpdateLog) {
      const { executor } = channelUpdateLog;
      embed.addFields(
        {
          name: `**Before**`,
          value: oldChan.name,
          inline: true,
        },
        { name: `**After**`, value: newChan.name, inline: true },
        { name: `**Updated By**`, value: executor, inline: true }
      );
    }
  }
  return embed;
};

module.exports.config = {
  displayName: "Channel Events",
  dbName: "CHANNEL_EVENTS",
  loadDBFirst: false,
};
