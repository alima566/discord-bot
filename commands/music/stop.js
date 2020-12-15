module.exports = {
  commands: "stop",
  category: "Music",
  description: "Stops the song.",
  callback: async (msg) => {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) {
      return msg.reply("You have to be in a voice channel to stop the music!");
    }
    msg.client.player.stop(msg);
    return;
  },
};
