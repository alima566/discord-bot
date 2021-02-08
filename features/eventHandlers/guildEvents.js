const { sendMessageToBotLog, fetchAuditLog } = require("@utils/functions");
const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
  client.on("guildBanAdd", async (guild, user) => {
    const msgEmbed = new MessageEmbed().setColor("#CC0202");
    const fetchedLogs = await fetchAuditLog(guild, "MEMBER_BAN_ADD");

    const banLog = fetchedLogs.entries.first();
    if (banLog) {
      const { executor, target } = banLog;
      msgEmbed
        .setAuthor(guild.name, guild.iconURL())
        .setDescription(
          `${
            target.id === user.id
              ? `**${user.tag} has been banned from the server by ${executor}**`
              : `**${user.tag} has been banned from the server**`
          }`
        )
        .setTimestamp()
        .setFooter(`ID: ${user.id}`);
      return sendMessageToBotLog(client, guild, msgEmbed);
    } else {
      msgEmbed
        .setAuthor(guild.name, guild.iconURL())
        .setDescription(`**${user.tag} has been banned from the server**`)
        .setTimestamp()
        .setFooter(`ID: ${user.id}`);
      return sendMessageToBotLog(client, guild, msgEmbed);
    }
  });

  client.on("guildBanRemove", async (guild, user) => {
    const msgEmbed = new MessageEmbed().setColor("#33a532");
    const fetchedLogs = await fetchAuditLog(guild, "MEMBER_BAN_REMOVE");

    const banLog = fetchedLogs.entries.first();
    if (banLog) {
      const { executor, target } = banLog;
      msgEmbed
        .setAuthor(guild.name, guild.iconURL())
        .setDescription(
          `${
            target.id === user.id
              ? `**${executor} removed ban from ${user.tag}**`
              : `**Removed ban from ${user.tag}**`
          }`
        )
        .setTimestamp()
        .setFooter(`ID: ${user.id}`);
      return sendMessageToBotLog(client, guild, msgEmbed);
    } else {
      msgEmbed
        .setAuthor(guild.name, guild.iconURL())
        .setDescription(`**Removed ban from ${user.tag}**`)
        .setTimestamp()
        .setFooter(`ID: ${user.id}`);
      return sendMessageToBotLog(client, guild, msgEmbed);
    }
  });
};

module.exports.config = {
  displayName: "Guild Events",
  dbName: "GUILD_EVENTS",
  loadDBFirst: false,
};
