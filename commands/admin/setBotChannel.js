const botChannelSchema = require("@schemas/bot-channel-schema");
const { botLoggingCache } = require("@root/config.json");

module.exports = {
  commands: ["setbotchan", "botchannel", "botchan"],
  category: "Admin",
  expectedArgs: "<The bot logging channel>",
  minArgs: 0,
  maxArgs: 1,
  description: "Sets the channel for all the bot logging.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async ({ message, client }) => {
    const { guild } = message;
    const channel = message.mentions.channels.first() || message.channel;
    const guildID = guild.id;

    botLoggingCache[guildID] = channel.id;

    await botChannelSchema.findOneAndUpdate(
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

    message
      .reply(`Bot logging channel has been set to <#${channel.id}>.`)
      .then((m) => {
        client.setTimeout(() => m.delete(), 1000 * 3);
      });
    message.delete();
  },
};
