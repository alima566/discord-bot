module.exports = {
  category: "Bot Owner",
  description: "Restarts the bot.",
  ownerOnly: true,
  callback: async ({ message }) => {
    message.channel.send("Restarting...").then(() => {
      process.exit();
    });
  },
};
