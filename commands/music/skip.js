module.exports = {
  commands: "skip",
  category: "Music",
  description: "Skips the current song.",
  callback: (msg) => {
    msg.client.player.skip(msg);
    return;
  },
};
