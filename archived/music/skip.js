module.exports = {
  commands: "skip",
  category: "Music",
  description: "Skips the current song.",
  callback: (msg) => {
    const serverQueue = msg.client.queue.get(msg.guild.id);
    if (!msg.member.voice.channel)
      return msg.channel.send(
        "You have to be in a voice channel to stop the music!"
      );
    if (!serverQueue)
      return msg.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
  },
};
