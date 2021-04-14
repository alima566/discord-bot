module.exports = {
  commands: "stop",
  category: "Archived/Music",
  description: "Stops the current song.",
  callback: (msg) => {
    try {
      const serverQueue = msg.client.queue.get(msg.guild.id);
      if (!msg.member.voice.channel)
        return msg.channel.send(
          "You have to be in a voice channel to stop the music!"
        );
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
    } catch (err) {
      msg.channel.send(`There is currently no song that is playing.`);
    }
  },
};
