module.exports = {
  commands: "restart",
  category: "Testing",
  description: "Restarts the bot.",
  ownerOnly: true,
  callback: async (msg) => {
    msg.channel.send("Restarting...").then(() => {
      process.exit(1);
    });
    msg.delete();
  },
};
