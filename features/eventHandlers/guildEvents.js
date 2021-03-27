const {
  sendMessageToBotLog,
  fetchAuditLog,
  guildIcon,
} = require("@utils/functions");
const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
  client.on("guildBanAdd", async (guild, user) => {
    const fetchedLogs = await fetchAuditLog(guild, "MEMBER_BAN_ADD");
    if (!fetchedLogs) {
      const msgEmbed = createEmbed(
        "#CC0202",
        guild,
        user,
        `**${user.tag} has been banned from the server**`
      );

      return sendMessageToBotLog(client, guild, msgEmbed);
    }

    const banLog = fetchedLogs.entries.first();
    if (!banLog) {
      const msgEmbed = createEmbed(
        "CC0202",
        guild,
        user,
        `**${user.tag} has been banned from the server**`
      );
      return sendMessageToBotLog(client, guild, msgEmbed);
    }

    const { executor, target } = banLog;
    const msgEmbed = createEmbed(
      "#CC0202",
      guild,
      user,
      `${
        target.id === user.id
          ? `**${user.tag} has been banned from the server by ${executor}**`
          : `**${user.tag} has been banned from the server**`
      }`
    );
    sendMessageToBotLog(client, guild, msgEmbed);
  });

  client.on("guildBanRemove", async (guild, user) => {
    const fetchedLogs = await fetchAuditLog(guild, "MEMBER_BAN_REMOVE");
    if (!fetchedLogs) {
      const msgEmbed = createEmbed(
        "#33a532",
        guild,
        user,
        `**Removed ban from ${user.tag}**`
      );
      return sendMessageToBotLog(client, guild, msgEmbed);
    }

    const banLog = fetchedLogs.entries.first();
    if (!banLog) {
      const msgEmbed = createEmbed(
        "#33a532",
        guild,
        user,
        `**Removed ban from ${user.tag}**`
      );
      return sendMessageToBotLog(client, guild, msgEmbed);
    }

    const { executor, target } = banLog;
    const msgEmbed = createEmbed(
      "#33a532",
      guild,
      user,
      `${
        target.id === user.id
          ? `**${executor} removed ban from ${user.tag}**`
          : `**Removed ban from ${user.tag}**`
      }`
    );
    sendMessageToBotLog(client, guild, msgEmbed);
  });
};

const createEmbed = (color, guild, user, description) => {
  return new MessageEmbed()
    .setColor(color)
    .setAuthor(guild.name, guildIcon(guild))
    .setDescription(description)
    .setTimestamp()
    .setFooter(`ID: ${user.id}`);
};

module.exports.config = {
  displayName: "Guild Events",
  dbName: "GUILD_EVENTS",
  loadDBFirst: false,
};
