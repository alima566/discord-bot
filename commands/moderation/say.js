module.exports = {
  commands: ["say"],
  category: "Moderation",
  expectedArgs: "<OPTIONAL: The tagged channel> <The message you want to say>",
  minArgs: 1,
  maxArgs: -1,
  description: "Makes the bot say whatever you type.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async (msg, args, text) => {
    let message = "";
    const channel = msg.mentions.channels.first();
    if (channel) {
      if (args.length === 1) {
        msg.channel.send(`Please provide something to say.`);
        return;
      }
      message = args.slice(1).join(" ");
      channel.send(message);
    } else {
      message = args.join(" ");
      msg.channel.send(message);
    }
  },
};
