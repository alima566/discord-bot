const { sendMessageToBotThings } = require("@utils/functions");
const { MessageEmbed } = require("discord.js");
module.exports = (client) => {
  client.on("messageDelete", async (msg) => {
    if (!msg.guild) return;

    let msgEmbed = new MessageEmbed().setColor("RED");
    if (!msg.partial) {
      if (msg.author.bot) return;
      msgEmbed
        .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL())
        .setDescription(
          `**Message sent by ${msg.author} deleted in ${msg.channel}**\n${msg}`
        )
        .setTimestamp()
        .setFooter(`Author: ${msg.author.id} | Message ID: ${msg.id}`);
    } else {
      msgEmbed
        .setAuthor(`${msg.guild.name}`, msg.guild.iconURL())
        .setDescription(`**Message deleted in ${msg.channel}**`)
        .setTimestamp()
        .setFooter(`Author: ? | Message ID: ${msg.id}`);
    }
    sendMessageToBotThings(client, msg.guild, msgEmbed);
  });
};

module.exports.config = {
  displayName: "Message Delete",
  dbName: "MESSAGE_DELETE",
  loadDBFirst: false,
};
