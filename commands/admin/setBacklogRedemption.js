const backlogRedemptionSchema = require("@schemas/backlog-redemptions-schema");
const { fetchRedemptionChannels } = require("@features/features/redemptions");

module.exports = {
  commands: ["setbacklog", "setredeem"],
  category: "Admin",
  expectedArgs: "<The backlog redemption channel>",
  minArgs: 0,
  maxArgs: 1,
  description: "Sets the channel for all the backlog redemption channel.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async ({ message, client }) => {
    const { guild } = message;
    const channel = message.mentions.channels.first() || message.channel;
    const guildID = guild.id;

    await backlogRedemptionSchema.findOneAndUpdate(
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
      .reply(`Backlog redemption channel has been set to <#${channel.id}>.`)
      .then((m) => {
        client.setTimeout(() => m.delete(), 1000 * 3);
      });
    message.delete();

    fetchRedemptionChannels(guildID);
  },
};
