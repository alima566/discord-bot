const { sendMessageToBotLog, fetchAuditLog } = require("@utils/functions");
const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
  client.on("messageDelete", async (msg) => {
    if (!msg.guild) return;

    const msgEmbed = new MessageEmbed().setColor("RED");
    const fetchedLogs = await fetchAuditLog(msg.guild, "MESSAGE_DELETE");

    const deletionLog = fetchedLogs.entries.first();
    if (!deletionLog) {
      msgEmbed
        .setAuthor(`${msg.guild.name}`, msg.guild.iconURL())
        .setDescription(
          `**Message sent by ${msg.author} was deleted in ${msg.channel}**`
        )
        .setTimestamp()
        .setFooter(`Message ID: ${msg.id}`);
      return sendMessageToBotLog(client, msg.guild, msgEmbed);
    }

    const { executor, target } = deletionLog;

    if (!msg.partial) {
      if (msg.author.bot) return;

      msgEmbed
        .setAuthor(
          `${msg.author.tag}`,
          msg.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          `**Message sent by ${msg.author} deleted in ${msg.channel}:**\n${
            msg.attachments.size > 0
              ? msg.attachments.first().proxyURL
              : msg.content
          }`
        )
        .setTimestamp()
        .setFooter(
          `${
            target.id === msg.author.id ? `\nDeleted by: ${executor.tag} |` : ""
          } Message ID: ${msg.id}`
        );
    } else {
      msgEmbed
        .setAuthor(`${msg.guild.name}`, msg.guild.iconURL())
        .setDescription(`**Message deleted in ${msg.channel}**`)
        .setTimestamp()
        .setFooter(`Message ID: ${msg.id}`);
    }
    sendMessageToBotLog(client, msg.guild, msgEmbed);
  });

  client.on("messageUpdate", async (oldMsg, newMsg) => {
    if (!oldMsg.guild || !newMsg.guild) return;

    const msgEmbed = new MessageEmbed().setColor("RED").setTimestamp();

    if (!oldMsg.partial && !newMsg.partial) {
      if (oldMsg.content !== newMsg.content) {
        if (newMsg.author.bot) return;

        msgEmbed
          .setAuthor(
            newMsg.author.tag,
            newMsg.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription(
            `[Message](${newMsg.url}) sent by ${newMsg.author} was edited in ${newMsg.channel}:`
          )
          .addFields(
            {
              name: "**Old Message**",
              value: oldMsg.content,
              inline: true,
            },
            {
              name: "**New Message**",
              value: newMsg.content,
              inline: true,
            }
          )
          .setFooter(`Message ID: ${newMsg.id}`);

        sendMessageToBotLog(client, newMsg.guild, msgEmbed);
      }
    } else {
      const newM = await newMsg.fetch();
      if (newM.author.bot) return;

      msgEmbed
        .setAuthor(
          newM.author.tag,
          newM.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          `[Message](${newMsg.url}) sent by ${newM.author} was edited in ${newM.channel}:`
        )
        .addFields(
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
        )
        .setFooter(`Message ID: ${newM.id}`);

      sendMessageToBotLog(client, newM.guild, msgEmbed);
    }
  });
};

module.exports.config = {
  displayName: "Message Events",
  dbName: "MESSAGE_EVENTS",
  loadDBFirst: false,
};
