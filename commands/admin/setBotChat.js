const botChatSchema = require("@schemas/bot-chat-schema");
const { setBotChatCache } = require("@utils/dbHelpers/botChat");

module.exports = {
  commands: ["botchat"],
  category: "Admin",
  expectedArgs: "<The bot chatting channel>",
  minArgs: 0,
  maxArgs: 1,
  description: "Sets the channel for bot chatting.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async ({ message, client }) => {
    const { guild } = message;
    const channel = message.mentions.channels.first() || message.channel;
    const guildID = guild.id;

    await botChatSchema.findOneAndUpdate(
      {
        _id: guildID,
      },
      {
        _id: guildID,
        channelID: channel.id,
      },
      {
        upsert: true,
      }
    );

    setBotChatCache(guild, channel);

    message
      .reply(`Bot chat channel has been set to <#${channel.id}>.`)
      .then((m) => {
        client.setTimeout(() => m.delete(), 1000 * 3);
      });
    message.delete();
  },
};
