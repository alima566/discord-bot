module.exports = {
  commands: ["say"],
  category: "Admin",
  expectedArgs: "<OPTIONAL: The tagged channel> <The message you want to say>",
  minArgs: 1,
  maxArgs: -1,
  description: "Makes the bot say whatever you type.",
  requiredPermissions: ["ADMINISTRATOR"],
  permissionError: "You must be an administrator to execute this command.",
  callback: async ({ message, args }) => {
    let msg = "";
    const channel = message.mentions.channels.first();
    if (channel) {
      if (args.length === 1) {
        return message.channel.send(`Please provide something to say.`);
      }
      msg = args.slice(1).join(" ");
      channel.send(msg);
    } else {
      msg = args.join(" ");
      message.channel.send(msg);
    }
    message.delete();
  },
};
