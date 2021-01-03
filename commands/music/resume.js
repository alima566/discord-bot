module.exports = {
  commands: ["resume"],
  category: "Music",
  description: "Resumes the paused music.",
  callback: async ({ message }) => {
    return message.client.player.resume(message);
  },
};
