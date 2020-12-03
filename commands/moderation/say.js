module.exports = {
  commands: ["say"],
  category: "Moderation",
  expectedArgs: "<The leaderboard channel>",
  minArgs: 1,
  maxArgs: -1,
  description: "Makes the bot say whatever you type.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async (msg, args, text) => {
    const channel = msg.mentions.channels.first() || msg.channel;
    let message = text;
    if (args[0].includes("<#")) {
      args.shift();
      message = args.join(" ");
    }
    channel.send(message);
    msg.delete();
  },
};
