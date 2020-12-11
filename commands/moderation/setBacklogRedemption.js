const backlogRedemptionSchema = require("@schemas/backlog-redemptions-schema");
const { fetchRedemptionChannels } = require("@features/redemptions");

module.exports = {
  commands: ["setbacklog", "setredeem"],
  category: "Moderation",
  expectedArgs: "<The backlog redemption channel>",
  minArgs: 0,
  maxArgs: 1,
  description: "Sets the channel for all the backlog redemption channel.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async (msg) => {
    const { guild } = msg;
    const channel = msg.mentions.channels.first() || msg.channel;
    const guildID = guild.id;

    await backlogRedemptionSchema.findOneAndUpdate(
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
      .reply(`Backlog redemption channel has been set to <#${channel.id}>.`)
      .then((m) => {
        m.delete({ timeout: 3000 });
      });
    msg.delete();

    fetchRedemptionChannels(guildID);
  },
};
