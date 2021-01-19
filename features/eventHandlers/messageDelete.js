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
};

module.exports.config = {
  displayName: "Message Delete",
  dbName: "MESSAGE_DELETE",
  loadDBFirst: false,
};
