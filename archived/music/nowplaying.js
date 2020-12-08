module.exports = {
  commands: ["nowplaying", "np", "currentsong"],
  category: "Archived/Music",
  description: "Shows what's currently playing.",
  callback: (msg) => {
    try {
      const serverQueue = msg.client.queue.get(msg.guild.id);
      if (!serverQueue) return msg.channel.send("There is nothing playing.");
      return msg.channel.send(`Now playing: **${serverQueue.songs[0].title}**`);
    } catch (err) {
      return msg.channel.send(`There is currently no song playing!`);
    }
  },
};
