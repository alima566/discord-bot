module.exports = {
  commands: "stop",
  category: "Music",
  description: "Stops the song.",
  callback: async ({ message }) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply(
        "You have to be in a voice channel to stop the music!"
      );
    }
    return message.client.player.stop(message);
  },
};
