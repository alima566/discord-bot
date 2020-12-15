module.exports = {
  commands: ["queue", "songs"],
  category: "Music",
  description: "Gets all the songs currently in the queue.",
  callback: async (msg) => {
    msg.client.player.getQueue(msg);
    console.log(msg.client.player.getQueue(msg));
  },
};
