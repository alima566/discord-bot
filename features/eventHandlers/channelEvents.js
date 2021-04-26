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
        `${getChannelDescription(channel.type)} Created: ${
          channel.type.toLowerCase() === "text" ||
          channel.type.toLowerCase() === "news"
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
        `${getChannelDescription(channel.type)} Created: ${
          channel.type.toLowerCase() === "text" ||
          channel.type.toLowerCase() === "news"
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
      `${getChannelDescription(channel.type)} Created: ${
        channel.type.toLowerCase() === "text" ||
        channel.type.toLowerCase() === "news"
          ? channel
          : `\`${channel.name}\``
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
        `${getChannelDescription(channel.type)} Deleted:** \`${channel.name}\``
      );
      return sendMessageToBotLog(client, channel.guild, msgEmbed);
    }

    const channelCreationLog = fetchedLogs.entries.first();
    if (!channelCreationLog) {
      const msgEmbed = await createChannelEmbed(
        channel,
        null,
        `${getChannelDescription(channel.type)} Deleted:** \`${channel.name}\``
      );
      return sendMessageToBotLog(client, channel.guild, msgEmbed);
    }

    const { executor } = channelCreationLog;
    const msgEmbed = await createChannelEmbed(
      channel,
      null,
      `${getChannelDescription(channel.type)} Deleted:** \`${
        channel.name
      }\`\n**Deleted By:** ${executor}`
    );
    sendMessageToBotLog(client, channel.guild, msgEmbed);
  });

  client.on("channelUpdate", async (oldChan, newChan) => {
    if (oldChan.name !== newChan.name) {
      const msgEmbed = await createChannelEmbed(
        oldChan,
        newChan,
        `${getChannelDescription(newChan.type)} Name Changed**`
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
            newChan.type.toLowerCase() === "text" ||
            newChan.type.toLowerCase() === "news"
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
            newChan.type.toLowerCase() === "text" ||
            newChan.type.toLowerCase() === "news"
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
          newChan.type.toLowerCase() === "text" ||
          newChan.type.toLowerCase() === "news"
            ? newChan
            : `\`${newChan.name}\``,
        inline: true,
      },
      { name: `**Updated By**`, value: executor, inline: true }
    );
  }
  return embed;
};

const getChannelDescription = (channelType) => {
  let channel;
  switch (channelType.toLowerCase()) {
    case "category":
      channel = "**Category";
      break;
    case "text":
      channel = "**Text Channel";
      break;
    case "news":
      channel = "**Announcement Channel";
      break;
    default:
      channel = "**Voice Channel";
      break;
  }
  return channel;
};

module.exports.config = {
  displayName: "Channel Events",
  dbName: "CHANNEL_EVENTS",
  loadDBFirst: false,
};
