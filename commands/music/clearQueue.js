module.exports = {
  commands: ["clear"],
  category: "🎵 Music",
  description: "Clears the queue.",
  callback: async ({ message }) => {
    message.client.player.clearQueue(message);
    return message.channel.send(`Music queue has been cleared.`);
  },
};
