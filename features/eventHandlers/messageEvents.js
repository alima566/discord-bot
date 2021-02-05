const { sendMessageToBotThings } = require("@utils/functions");
const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
  client.on("messageDelete", async (msg) => {
    if (!msg.guild) return;

    const fetchedLogs = await msg.guild.fetchAuditLogs({
      limit: 1,
      type: "MESSAGE_DELETE",
    });

    const deletionLog = fetchedLogs.entries.first();
    if (!deletionLog) return;

    const { executor, target } = deletionLog;

    const msgEmbed = new MessageEmbed().setColor("RED");
    if (!msg.partial) {
      if (msg.author.bot) return;
      msgEmbed
        .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL())
        .setDescription(
          `**Message sent by ${msg.author} deleted in ${msg.channel}**\n${msg}`
        )
        .setTimestamp()
        .setFooter(
          `${
            target.id === msg.author.id ? `\nDeleted by: ${executor.tag} |` : ""
          } Message ID: ${msg.id}`
        );
      //.setFooter(`Author: ${msg.author.id} | Message ID: ${msg.id}`);
    } else {
      msgEmbed
        .setAuthor(`${msg.guild.name}`, msg.guild.iconURL())
        .setDescription(`**Message deleted in ${msg.channel}**`)
        .setTimestamp()
        .setFooter(`Message ID: ${msg.id}`);
    }
    sendMessageToBotThings(client, msg.guild, msgEmbed);
  });

  client.on("messageUpdate", async (oldMsg, newMsg) => {
    if (!oldMsg.guild || !newMsg.guild) return;

    if (
      oldMsg.channel.id === "771015880883699732" || //rules-and-reactions channel
      oldMsg.channel.id === "732786545169399838" //leaderboard channel
    )
      return;

    if (!oldMsg.partial && !newMsg.partial) {
      if (oldMsg.content !== newMsg.content) {
        if (newMsg.author.bot) return;
        const msgEmbed = new MessageEmbed()
          .setColor("RED")
          .setAuthor(newMsg.author.tag, newMsg.author.displayAvatarURL())
          .setDescription(
            `Message sent by ${newMsg.author} was edited in ${newMsg.channel}:`
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
          .setFooter(`Message ID: ${newMsg.id}`)
          .setTimestamp();

        sendMessageToBotThings(client, newMsg.guild, msgEmbed);
      }
    } else {
      const newM = await newMsg.fetch();

      if (newM.author.bot) return;

      const msgEmbed = new MessageEmbed()
        .setColor("RED")
        .setAuthor(newM.author.tag, newM.author.displayAvatarURL())
        .setDescription(
          `Message sent by ${newM.author} was edited in ${newM.channel}:`
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
        .setFooter(`Message ID: ${newM.id}`)
        .setTimestamp();

      sendMessageToBotThings(client, newM.guild, msgEmbed);
    }
  });
};

module.exports.config = {
  displayName: "Message Events",
  dbName: "MESSAGE_EVENTS",
  loadDBFirst: false,
};
