module.exports = {
  commands: "stop",
  category: "Music",
  description: "Stops the song.",
  callback: async (msg) => {
    msg.client.player.stop(msg);
    return;
  },
};
