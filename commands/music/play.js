module.exports = {
  commands: "play",
  category: "Music",
  expectedArgs: "<Search query>",
  minArgs: 1,
  maxArgs: -1,
  description: "Plays the specified song.",
  callback: ({ message, args }) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply(
        `You need to be in a voice channel in order to play music!`
      );
    }
    return message.client.player.play(message, args.join(" "));
  },
};
