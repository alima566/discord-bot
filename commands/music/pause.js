module.exports = {
  name: ["pause"],
  category: "Music",
  description: "Pauses the music.",
  callback: async (msg) => {
    msg.client.player.pause(msg);
    return;
  },
};
