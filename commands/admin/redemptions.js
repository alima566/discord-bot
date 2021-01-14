const {
  statusMessages,
  redemptionCache,
} = require("@features/features/redemptions");

const { MessageEmbed } = require("discord.js");

module.exports = {
  commands: ["redeem", "redemption"],
  category: "Admin",
  minArgs: 2,
  maxArgs: 2,
  expectedArgs: "<Message ID> <Status>",
  description: "Updates the status of a redemption.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async ({ message, args }) => {
    const { guild } = message;
    const messageID = args.shift();
    const status = args.shift().toUpperCase();

    message.delete();

    const newStatus = statusMessages[status];
    if (!newStatus) {
      message.reply(
        `Unknown status "${status}". Please use ${Object.keys(statusMessages)}.`
      );
      return;
    }

    const channelID = redemptionCache()[guild.id];
    if (!channelID) {
      return;
    }

    const channel = guild.channels.cache.get(channelID);
    if (!channel) {
      message.reply(`The redemption channel no longer exists.`);
      return;
    }

    const targetMessage = await channel.messages.fetch(messageID, false, true);
    if (!targetMessage) {
      message.reply(`That message no longer exists.`);
      return;
    }

    const oldEmbed = targetMessage.embeds[0];
    const newEmbed = new MessageEmbed()
      .setAuthor(oldEmbed.author.name, oldEmbed.author.iconURL)
      .setDescription(oldEmbed.description)
      .setColor(newStatus.color)
      .setTimestamp();

    if (oldEmbed.fields.length === 2) {
      newEmbed.addFields(oldEmbed.fileds[0], {
        name: "**Status**",
        value: `${newStatus.text}`,
      });
    } else {
      newEmbed.addFields({
        name: "**Status**",
        value: `${newStatus.text}`,
      });
    }

    targetMessage.edit(newEmbed);
  },
};
