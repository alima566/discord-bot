module.exports = {
  commands: ["pause"],
  category: "Music",
  description: "Pauses the music.",
  callback: async ({ message }) => {
    return message.client.player.pause(message);
  },
};
