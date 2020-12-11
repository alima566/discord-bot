const {
  statusMessages,
  redemptionCache,
} = require("@features/features/redemptions");

const { MessageEmbed } = require("discord.js");

module.exports = {
  commands: ["redeem", "redemption"],
  category: "Moderation",
  minArgs: 2,
  maxArgs: 2,
  expectedArgs: "<Message ID> <Status>",
  description: "Updates the status of a redemption.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async (msg, args) => {
    const { guild } = msg;
    const messageID = args.shift();
    const status = args.shift().toUpperCase();

    msg.delete();

    const newStatus = statusMessages[status];
    if (!newStatus) {
      msg.reply(
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
      msg.reply(`The redemption channel no longer exists.`);
      return;
    }

    const targetMessage = await channel.messages.fetch(messageID, false, true);
    if (!targetMessage) {
      msg.reply(`That message no onger exists.`);
      return;
    }

    const oldEmbed = targetMessage.embeds[0];
    const newEmbed = new MessageEmbed()
      .setAuthor(oldEmbed.author.name, oldEmbed.author.iconURL)
      .setDescription(oldEmbed.description)
      .setColor(newStatus.color);

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
