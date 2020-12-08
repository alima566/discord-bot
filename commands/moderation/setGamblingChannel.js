const gamblingChannelSchema = require("@schemas/gambling-channel-schema");
module.exports = {
  commands: ["setgambling", "setgamblingchan", "setgamblingchannel"],
  category: "Moderation",
  expectedArgs: "<The gambling channel>",
  minArgs: 0,
  maxArgs: 1,
  description: "Sets the gambling channel for a server.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async (msg) => {
    const { guild } = msg;
    const channel = msg.mentions.channels.first() || msg.channel;
    const guildID = guild.id;

    await gamblingChannelSchema.findOneAndUpdate(
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
      .reply(`Gambling channel has been set to <#${channel.id}>.`)
      .then((m) => {
        m.delete({ timeout: 3000 });
      });
    msg.delete();
  },
};
