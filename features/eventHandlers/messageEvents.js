const {
  sendMessageToBotLog,
  fetchAuditLog,
  guildIcon,
} = require("@utils/functions");
const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
  client.on("messageDelete", async (msg) => {
    if (!msg.guild) return;

    const fetchedLogs = await fetchAuditLog(msg.guild, "MESSAGE_DELETE");
    if (!fetchedLogs) {
      const msgEmbed = createEmbed(
        "RED",
        msg.guild,
        msg,
        `**A message sent by ${msg.author} was deleted in ${msg.channel}:**\n${msg.content}`
      );
      return sendMessageToBotLog(client, msg.guild, msgEmbed);
    }

    const deletionLog = fetchedLogs.entries.first();
    if (!deletionLog) {
      const msgEmbed = createEmbed(
        "RED",
        msg.guild,
        msg,
        `**A message sent by ${msg.author} was deleted in ${msg.channel}**`
      );
      return sendMessageToBotLog(client, msg.guild, msgEmbed);
    }

    const { executor, target } = deletionLog;

    if (!msg.partial) {
      if (msg.author.bot) return;

      let description = `**A message sent by ${msg.author} was deleted in ${
        msg.channel
      } ${target.id === msg.author.id ? ` by ${executor}` : ""}:**\n`;

      if (msg.attachments.size > 0 && msg.content !== "") {
        description += `${msg.content}\n${msg.attachments.first().proxyURL}`;
      } else if (msg.attachments.size > 0) {
        description += msg.attachments.first().proxyURL;
      } else {
        description += msg.content;
      }

      const msgEmbed = createEmbed(
        "RED",
        msg.guild,
        msg,
        description,
        msg.author
      );
      sendMessageToBotLog(client, msg.guild, msgEmbed);
    } else {
      const msgEmbed = createEmbed(
        "RED",
        msg.guild,
        msg,
        `**A message was deleted in ${msg.channel}**`
      );
      sendMessageToBotLog(client, msg.guild, msgEmbed);
    }
  });

  client.on("messageUpdate", async (oldMsg, newMsg) => {
    if (!oldMsg.guild || !newMsg.guild) return;

    if (!oldMsg.partial && !newMsg.partial) {
      if (oldMsg.content !== newMsg.content) {
        if (newMsg.author.bot) return;
        const msgEmbed = createEmbed(
          "RED",
          newMsg.guild,
          newMsg,
          `**A [message](${newMsg.url}) sent by ${newMsg.author} was edited in ${newMsg.channel}:**`,
          newMsg.author
        ).addFields(
          {
            name: "**Old Message**",
            value: oldMsg.content === "" ? "-" : oldMsg.content,
          },
          {
            name: "**New Message**",
            value: newMsg.content,
          }
        );
        sendMessageToBotLog(client, newMsg.guild, msgEmbed);
      }
    } else {
      const newM = await newMsg.fetch();
      if (newM.author.bot) return;
      const msgEmbed = createEmbed(
        "RED",
        newM.guild,
        newM,
        `A [message](${newM.url}) sent by ${newM.author} was edited in ${newM.channel}:`,
        newM.author
      ).addFields(
        {
          name: "**Old Message**",
          value: "Unknown",
          inline: true,
        },
        {
          name: "**New Message**",
          value: newM.content,
          inline: true,
        }
      );
      sendMessageToBotLog(client, newM.guild, msgEmbed);
    }
  });
};

const createEmbed = (color, guild, msg, description, user) => {
  return new MessageEmbed()
    .setColor(color)
    .setAuthor(
      user ? user.tag : guild.name,
      user ? user.displayAvatarURL({ dynamic: true }) : guildIcon(guild)
    )
    .setDescription(description)
    .setTimestamp()
    .setFooter(`ID: ${msg.id}`);
};

module.exports.config = {
  displayName: "Message Events",
  dbName: "MESSAGE_EVENTS",
  loadDBFirst: false,
};
