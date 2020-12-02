const gamblingLeaderboardSchema = require("@schemas/gambling-leaderboard-schema");
module.exports = {
  commands: ["setleaderboard"],
  category: "Moderation",
  expectedArgs: "<The leaderboard channel>",
  minArgs: 0,
  maxArgs: 1,
  description: "Sets the leaderboard channel for a server.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async (msg) => {
    const { guild } = msg;
    const channel = msg.mentions.channels.first() || msg.channel;
    const guildID = guild.id;

    await gamblingLeaderboardSchema.findOneAndUpdate(
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

    msg.reply(`Leaderboard has been set to <#${channel.id}>.`).then((m) => {
      m.delete({ timeout: 3000 });
    });
    msg.delete();
  },
};
