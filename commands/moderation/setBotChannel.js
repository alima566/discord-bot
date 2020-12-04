const botChannelSchema = require("@schemas/bot-channel-schema");
module.exports = {
  commands: ["setbotchan", "botchannel", "botchan"],
  category: "Moderation",
  expectedArgs: "<The bot logging channel>",
  minArgs: 0,
  maxArgs: 1,
  description: "Sets the channel for all the bot logging.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async (msg) => {
    const { guild } = msg;
    const channel = msg.mentions.channels.first() || msg.channel;
    const guildID = guild.id;

    await botChannelSchema.findOneAndUpdate(
      {
        _id: guildID,
        channelID: channel.id,
      },
      {
        _id: guildID,
        channelID: channel.id,
      },
      {
        upsert: true,
      }
    );

    msg
      .reply(`Bot loggin channel has been set to <#${channel.id}>.`)
      .then((m) => {
        m.delete({ timeout: 3000 });
      });
    msg.delete();
  },
};
