module.exports = {
  commands: ["clear", "clearqueue"],
  category: "Music",
  description: "Clears the queue.",
  callback: async (msg) => {
    msg.client.player.clearQueue(msg);
    return msg.channel.send(`Music queue has been cleared.`);
  },
};
