module.exports = {
  commands: ["resume"],
  category: "Music",
  description: "Resumes the paused music.",
  callback: async (msg) => {
    msg.client.player.resume(msg);
    return;
  },
};
