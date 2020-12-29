module.exports = {
  commands: "play",
  category: "Music",
  expectedArgs: "<Search query>",
  minArgs: 1,
  maxArgs: -1,
  description: "Plays the specified song.",
  callback: (msg, args) => {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) {
      return msg.reply(
        `You need to be in a voice channel in order to play music!`
      );
    }
    return msg.client.player.play(msg, args.join(" "));
  },
};
