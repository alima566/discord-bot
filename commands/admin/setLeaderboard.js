const gamblingLeaderboardSchema = require("@schemas/gambling-leaderboard-schema");
module.exports = {
  commands: ["setleaderboard"],
  category: "Admin",
  expectedArgs: "<The leaderboard channel>",
  minArgs: 0,
  maxArgs: 1,
  description: "Sets the leaderboard channel for a server.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async ({ message }) => {
    const { guild } = message;
    const channel = message.mentions.channels.first() || message.channel;
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

    message.reply(`Leaderboard has been set to <#${channel.id}>.`).then((m) => {
      m.delete({ timeout: 3000 });
    });
    message.delete();
  },
};
