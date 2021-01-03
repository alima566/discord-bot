module.exports = {
  commands: "skip",
  category: "Music",
  description: "Skips the current song.",
  callback: ({ message }) => {
    return message.client.player.skip(message);
  },
};
