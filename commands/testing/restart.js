module.exports = {
  commands: "restart",
  category: "Testing",
  description: "Restarts the bot.",
  permissionError: "You must be an administrator to execute this command.",
  requiredPermissions: ["ADMINISTRATOR"],
  callback: async (msg) => {
    msg.channel.send("Restarting...").then(() => {
      process.exit(1);
    });
    msg.delete();
  },
};
