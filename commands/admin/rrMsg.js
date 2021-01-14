const messageRolesSchema = require("@schemas/message-roles-schema");
const { log } = require("@utils/functions");
const { addToCache } = require("@features/features/reactionRoles");

module.exports = {
  minArgs: 1,
  expectedArgs: "[Channel Tag] <Message Text>",
  category: "Admin",
  description: "Sets a reaction message for reaction roles.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: async ({ message, args }) => {
    const { guild, mentions } = message;
    const { channels } = mentions;
    const targetChannel = channels.first() || message.channel;

    if (channels.first()) {
      args.shift();
    }

    const text = args.join(" ");
    const newMessage = await targetChannel.send(text);

    if (guild.me.hasPermission("MANAGE_MESSAGES")) {
      message.delete();
    }

    if (!guild.me.hasPermission("MANAGE_ROLES")) {
      return message.reply("I do not have the `Manage Roles` permission.");
    }

    addToCache(guild.id, newMessage);

    new messageRolesSchema({
      guildID: guild.id,
      channelID: targetChannel.id,
      messageID: newMessage.id,
    })
      .save()
      .catch((e) => {
        message
          .reply("An error occurred and failed to save to database.")
          .then((m) => {
            m.delete({ timeout: 1000 * 5 });
          });
        log(
          "ERROR",
          "./commands/moderation/rrMsg.js",
          `An error has occurred: ${e.message}`
        );
      });
  },
};
