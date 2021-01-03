module.exports = {
  commands: "restart",
  category: "Testing",
  description: "Restarts the bot.",
  ownerOnly: true,
  callback: async ({ message }) => {
    message.channel.send("Restarting...").then(() => {
      process.exit(1);
    });
    message.delete();
  },
};
