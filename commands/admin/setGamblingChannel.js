const gamblingChannelSchema = require("@schemas/gambling-channel-schema");
const { gamblingChannelCache } = require("@root/config.json");

module.exports = {
  commands: ["setgambling", "setgamblingchan", "setgamblingchannel"],
  category: "Admin",
  expectedArgs: "<The gambling channel>",
  minArgs: 0,
  maxArgs: 1,
  description: "Sets the gambling channel for a server.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async ({ message, client }) => {
    const { guild } = message;
    const channel = message.mentions.channels.first() || message.channel;
    const guildID = guild.id;

    gamblingChannelCache[guildID] = channel.id;

    await gamblingChannelSchema.findOneAndUpdate(
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
      .reply(`Gambling channel has been set to <#${channel.id}>.`)
      .then((m) => {
        client.setTimeout(() => m.delete(), 1000 * 3);
      });
    message.delete();
  },
};
